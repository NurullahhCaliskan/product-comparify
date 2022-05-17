export default class WebhookValidator {
  async verifyWebhook(payload, hmac) {
    const message = payload.toString();
    const genHash = crypto
      .createHmac("sha256", "111948adb6e3b73ccd989f9bc0f61e58")
      .update(message)
      .digest("base64");
    console.log(genHash);
    console.log("verifyWebhook result");
    console.log(genHash === hmac);
    return genHash === hmac;
  }
}
