var SGmail = require("@sendgrid/mail");
const { development } = require("../config/config");
SGmail.setApiKey(development.sGmailKey);
let sendMail = (email, id) => {
    const msg = {
        to: email,
        from: "bhattmanju46@gmail.com",
        subject: "Sending with Twilio SendGrid is Fun",
        text: "Registered Successfully",
        html: `You're on your way!<br>Let's confirm your email addressBy clicking on the following link, you are confirming your email address<br>${development.serverIP}/verify/${id}`
    };
    SGmail.send(msg)
        .then(response => console.log("response of email---", response))
        .catch(error => console.log("Error>>>", error));
};

module.exports = { sendMail };
