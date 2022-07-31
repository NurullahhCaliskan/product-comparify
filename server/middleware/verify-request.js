import { Shopify } from '@shopify/shopify-api';
import { getBrowserName } from '../utility/helper.js';
import logHistoryService from '../service/logHistoryService.js';
import LogHistoryService from '../service/logHistoryService.js';
import sizeof from 'object-sizeof';
import { dbActive } from '../static/db.js';

const TEST_GRAPHQL_QUERY = `
{
  shop {
    name
  }
}`;

const resDotSendInterceptor = (res, send) => (content) => {
    res.contentBody = content;
    res.send = send;
    res.send(content);
};

export default function verifyRequest(app, { returnHeader = true } = {}) {
    return async (req, res, next) => {
        let logHistoryService = new LogHistoryService();
        const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'));
        const requestStart = Date.now();

        res.send = resDotSendInterceptor(res, res.send);

        if (!dbActive) {
            return res.status(503).send('Service Unavailable');
        }

        res.on('finish', () => {
            const { rawHeaders, httpVersion, method, socket, url } = req;
            const { remoteAddress, remoteFamily } = socket;

            let logJson = {
                storeId: session.onlineAccessInfo.associated_user.storeId,
                userId: session.onlineAccessInfo.associated_user.id,
                timestamp: Date.now(),
                processingTime: Date.now() - requestStart,
                browser: getBrowserName(req.headers['user-agent']),
                start_date: new Date(),
                method,
                url,
                httpVersion,
                remoteAddress,
                remoteFamily,
                size: sizeof(res.contentBody),
                status_code: res.statusCode,
            };

            logHistoryService.saveLogHistory(logJson);
        });

        let shop = req.query.shop;

        if (session && shop && session.shop !== shop) {
            // The current request is for a different shop. Redirect gracefully.
            return res.redirect(`/auth?shop=${shop}`);
        }

        if (session?.isActive()) {
            try {
                // make a request to make sure oauth has succeeded, retry otherwise
                const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
                await client.query({ data: TEST_GRAPHQL_QUERY });
                return next();
            } catch (e) {
                if (e instanceof Shopify.Errors.HttpResponseError && e.response.code === 401) {
                    // We only want to catch 401s here, anything else should bubble up
                } else {
                    throw e;
                }
            }
        }

        if (returnHeader) {
            if (!shop) {
                if (session) {
                    shop = session.shop;
                } else if (Shopify.Context.IS_EMBEDDED_APP) {
                    const authHeader = req.headers.authorization;
                    const matches = authHeader?.match(/Bearer (.*)/);
                    if (matches) {
                        const payload = Shopify.Utils.decodeSessionToken(matches[1]);
                        shop = payload.dest.replace('https://', '');
                    }
                }
            }

            if (!shop || shop === '') {
                return res.status(400).send(`Could not find a shop to authenticate with. Make sure you are making your XHR request with App Bridge's authenticatedFetch method.`);
            }

            res.status(403);
            res.header('X-Shopify-API-Request-Failure-Reauthorize', '1');
            res.header('X-Shopify-API-Request-Failure-Reauthorize-Url', `/auth?shop=${shop}`);
            res.end();
        } else {
            res.redirect(`/auth?shop=${shop}`);
        }
    };
}
