const nodemailer = require("nodemailer");
const ErorrHandler = require("./ErrorHandler");
const Student = require("../models/studentModel");

exports.sendmail = (req, res, next) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        post: 465,
        auth: {
            user: process.env.MAIL_EMAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: "Hirewell Pvt <ritikbeldar011@gmail.com>",
        to: req.body.email,
        subject: "Thank you for contacting us",
        text: `Dear ${req.body.firstname},\n\nThank you for reaching out to us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nHireWell `,
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) return next(new ErorrHandler(err, 500));
        console.log(info);

        return res.redirect("/contactUs");
    });
};




