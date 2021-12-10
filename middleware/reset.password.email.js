const SendinBlue = require("sib-api-v3-sdk");
export class ResetPasswordEmail {
  defaultClient = SendinBlue.ApiClient.instance;
  sendResetPasswordEmail(passwordReset) {
    const apiKey = this.defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.SENDIN_BLUE_SECRET_KEY;
    const transacEmailInstance = new SendinBlue.TransactionalEmailsApi();
    const sendSmtpEmail = new SendinBlue.SendSmtpEmail();
    sendSmtpEmail.subject = "Reset Password for your account {{params.email}}";
    sendSmtpEmail.htmlContent =
      '<html><body><p>You\'ve request to reset your password on {{params.email}}</p><br><p>Please refer to this URL to reset your password: {{params.link}}</p><br><p style="color: #ff0000">If you did not request this, you can safely ignore this message, Thank You<br></p><p><strong>-Team Creative Cookie Studio</strong></p></body></html>';
    sendSmtpEmail.sender = {
      name: "Reset Password(Creative Cookie Studio)",
      email: "tvbox9.box@gmail.com",
    };
    sendSmtpEmail.to = [
      { email: passwordReset.password_reset_email_ref, name: "Creative Cookie Studio User" },
    ];
    sendSmtpEmail.params = {
      email: passwordReset.password_reset_email_ref,
      link:
        process.env.NODE_ENV === "production"
          ? `https://www.creative-cookie.studio/reset-password?t=${passwordReset.password_reset_id}`
          : `http://localhost:3000/reset-password?t=${passwordReset.password_reset_id}`,
    };
    transacEmailInstance
      .sendTransacEmail(sendSmtpEmail)
      .then((res) => {
        console.log("RESET PASSWORD SUCCESSFULLY SENT");
      })
      .catch((err) => {
        console.log("ERROR");
      });
  }
}
