export default class WebhookValidator {
  async verifyWebhook(payload, hmac) {
    const message = payload.toString();
    const genHash = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
      .update(message)
      .digest("base64");
    console.log(genHash);
    return genHash === hmac;
  }
}
