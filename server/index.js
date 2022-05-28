import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import SessionService from "./service/sessionService.js";
import ScrapValidator from "./validate/scrapValidator.js";
import bp from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import UrlToScrapService from "./service/urlToScrapService.js";
import MailValidator from "./validate/mailValidator.js";
import MailService from "./service/mailService.js";
import IsNotValidUrlException from "./exception/isNotValidUrlException.js";
import { urlFormatter } from "./utility/stringUtility.js";
import * as mongoDB from "mongodb";
import { collections } from "./database.config.js";
import UserService from "./service/userService.js";
import ContactSupportService from "./service/contactSupportService.js";
import MailHistoryService from "./service/mailHistoryService.js";
import WebhookValidator from "./validate/webhookValidator.js";
import verifyWebhook from "verify-shopify-webhook";
import { Webhook } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import { Customer } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

async function loadDb() {
  try {
    let client = new mongoDB.MongoClient(process.env.DBHOST);

    console.log(process.env.BACKENDURL);
    console.log(process.env.SHOPIFY_API_KEY);
    console.log(process.env.NODE_ENV);
    await client.connect();

    let db = client.db(process.env.DBNAME);
    collections.userWebsitesRelationModel = db.collection(
      "user-websites-relation"
    );
    collections.websitesModel = db.collection("websites");
    collections.productHistoryModel = db.collection("product-history");
    collections.userModel = db.collection("user");
    collections.userSessionModel = db.collection("user-session");
    collections.mailHistoryModel = db.collection("mail-history");
    collections.contactSupportModel = db.collection("contact-support");

    console.log("success load db4");
    console.log(process.env.HOST.replace(/https:\/\//, ""));
  } catch (e) {
    console.log(e);
  }
}

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();

  await loadDb();

  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      if (!res.headersSent) {
        res.status(500).send(error.message);
      }
    }
  });

  app.get("/products-count", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });

    res.status(200).send(countData);
  });

  app.get("/get-mail-history", verifyRequest(app), async (req, res) => {
    let response = [];
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);

      let mailHistoryService = new MailHistoryService();

      response = await mailHistoryService.getMailHistoryByUserid(session.id);
    } catch (e) {
      console.log(e);
    }

    res.status(200).send(JSON.stringify(response));
  });

  app.get("/send-test-mail", verifyRequest(app), async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);

      let url = process.env.BACKENDURL + "/mail/test?id=" + session.id;
      let response = await axios.get(url);
    } catch (e) {
      console.log(e);
    }

    res.status(200).send(JSON.stringify({ result: "success" }));
  });

  app.post("/contact-support", async (req, res) => {
    console.log("contact-support");
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);

      let body = req.body;

      let contactSupportService = new ContactSupportService();

      await contactSupportService.saveContactSupportService(
        session.id,
        body.subject,
        body.message
      );
    } catch (e) {
      console.log(e);
    }
    return res
      .status(200)
      .send(JSON.stringify({ data: "New message inserted successfully" }));
  });

  app.post("/user-crawl-url", verifyRequest(app), async (req, res) => {
    let body = req.body;
    body.url = urlFormatter(body.url);

    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    try {
      let scrapService = new ScrapValidator();
      await scrapService.checkValidShopifyUrl(body.url);

      let urlToScrapService = new UrlToScrapService();
      await urlToScrapService.isExistsUserToUrlRelation(body.url, session.id);
      await urlToScrapService.addUrlToScrapService(body.url, session.id);
    } catch (e) {
      if (e instanceof IsNotValidUrlException) {
        return res.status(422).send(e.message);
      }
      console.log(e);
      return res.status(422).send(e.message);
    }

    return res
      .status(200)
      .send(JSON.stringify({ data: "New url inserted successfully" }));
  });

  app.put("/user-crawl-url", verifyRequest(app), async (req, res) => {
    let body = req.body;

    const session = await Shopify.Utils.loadCurrentSession(req, res, true);

    let urlToScrapService = new UrlToScrapService();
    try {
      let scrapService = new ScrapValidator();
      await scrapService.checkValidShopifyUrl(body.url);

      await urlToScrapService.updateUrl(body, session.id);
    } catch (e) {
      if (e instanceof IsNotValidUrlException) {
        return res.status(422).send(e.message);
      }
      return res.status(422).send(e.message);
    }

    return res
      .status(200)
      .send(JSON.stringify({ data: "Url updated successfully" }));
  });

  app.get("/user-mail", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);

    try {
      let mailService = new MailService();
      let result = await mailService.getUserMail(session.id);
      return res.status(200).send(JSON.stringify(result));
    } catch (e) {
      return res.status(422).send(e.message);
    }
  });

  app.delete("/user-crawl-url", verifyRequest(app), async (req, res) => {
    let id = req.query.id.trim().replaceAll('"', "");
    try {
      let urlToScrapService = new UrlToScrapService();
      await urlToScrapService.deleteUrlToScrapService(id);
    } catch (e) {
      return res.status(422).send(e.message);
    }

    return res
      .status(200)
      .send(JSON.stringify({ data: "Url deleted successfully" }));
  });

  app.post("/user-mail", verifyRequest(app), async (req, res) => {
    let body = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);

    try {
      let mailValidator = new MailValidator();
      mailValidator.checkValidShopifyUrl(body.email);

      let mailService = new MailService();

      await mailService.upsertUserMail(body.email, session.id);
    } catch (e) {
      return res.status(422).send(e.message);
    }

    return res
      .status(200)
      .send(JSON.stringify({ data: "Mail updated successfully" }));
  });

  app.get("/user-crawl-url", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);

    let urlToScrapService = new UrlToScrapService();
    let data = await urlToScrapService.getUrlToScrapService(session.id);
    return res.status(200).send(JSON.stringify(data));
  });

  app.get("/login", verifyRequest(app), async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);
      let sessionService = new SessionService();
      sessionService.session(session);
    } catch (e) {
      console.log(e);
    }

    res.status(200).send("countData");
  });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/customers-data_request", async (req, res) => {
    try {
      const shopifySecret = process.env.SHOPIFY_API_SECRET;

      const { verified, topic, domain, body } = await verifyWebhook(
        req,
        shopifySecret
      );

      console.log("/customers-data_request");
      console.log({ verified, topic, domain, body });
      if (!verified) {
        return res.status(401).send();
      }
    } catch (e) {
      console.log(e);
      return res.status(401).send();
    }

    return res.status(200).send();
  });

  app.post("/customers-redact", async (req, res) => {
    try {
      const shopifySecret = process.env.SHOPIFY_API_SECRET;

      const { verified, topic, domain, body } = await verifyWebhook(
        req,
        shopifySecret
      );

      console.log("/customers-redact");
      console.log({ verified, topic, domain, body });
      if (!verified) {
        return res.status(401).send();
      }
    } catch (e) {
      console.log(e);
      return res.status(401).send();
    }

    return res.status(200).send();
  });

  app.post("/shop-redact", async (req, res) => {
    try {
      const shopifySecret = process.env.SHOPIFY_API_SECRET;

      const { verified, topic, domain, body } = await verifyWebhook(
        req,
        shopifySecret
      );

      console.log("/shop-redact");
      console.log({ verified, topic, domain, body });
      if (!verified) {
        return res.status(401).send();
      }
    } catch (e) {
      console.log(e);
      return res.status(401).send();
    }

    return res.status(200).send();
  });

  app.use(express.json());

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
