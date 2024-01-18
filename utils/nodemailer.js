const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

const sendmail = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_EMAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: "Hirewell Pvt",
        to: req.body.email,
        subject: "Thank you for contacting us",
        text: `Dear ${req.body.firstname},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nHireWell `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return next(new ErrorHandler(err, 500));
        
        console.log(info);

        return res.redirect("/contactUs");
    });
};
module.exports = { sendmail };

