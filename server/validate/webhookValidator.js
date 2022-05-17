export default class WebhookValidator {
  async verifyWebhook(payload, hmac) {
    const message = payload.toString();
    const genHash = crypto
      .createHmac("sha256", process.env.API_SECRET)
      .update(message)
      .digest("base64");
    console.log(genHash);
    console.log("verifyWebhook result");
    console.log(genHash === hmac);
    return genHash === hmac;
  }
}
