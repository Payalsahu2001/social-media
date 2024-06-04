const nodemailer = require("nodemailer");

const sendmail = async (res, users, url) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: "payalsahu1062000@gmail.com",
                pass: "mukypzdvnoftmmck",
            },
        });

        const mailoptions = {
            from: "<Social Media Private Limited>",
            to: users.email,
            subject: "users Reset Password",
            text: "",
            html: `<a href=${url}>Reset Password Link</a>`,
        };

        transport.sendMail(mailoptions, async (err, info) => {
            if (err) res.send(err);
            console.log(info);

            users.resetPasswordToken = 1;
            await users.save();

            res.send(
                `<h1 style="text-align:center; margin-top: 20px; color: tomato;">Check Inbox/Spam</h1>`
            );
        });
    } catch (error) {
        res.send(error);
    }
};

module.exports = sendmail;





// const nodemailer = require("nodemailer");

// const sendmail = async (res, email, User) => {
//     try {
//         const url = `http://localhost:3000/forget-password/${User._id}`;

    

//         const transport = nodemailer.createTransport({
//             service: "gmail",
//             host: "smtp.gmail.com",
//             port: 465,
//             auth: {
//                 user: "payalsahu1062000@gmail.com",
//                 pass: "mukypzdvnoftmmck",
//             },
//         });

//         const mailOptions = {
//             from: "Social Media Private Ltd. <social@media.pvt.ltd>",
//             to: email,
//             subject: "Password Reset Link",
//             text: "Do not share this link to anyone",
//             html: `<a href="${url}">Reset Password Link </a>`,
//         };

//         transport.sendMail(mailOptions, async (err, info) => {
//             if (err){ 
//                 console.log(err);
//                 return res.send(err);}
//             console.log(info);

//             User.resetPasswordToken = 1;
//             await User.save();

//             res.send(
//                 `<h1 class="text-5xl text-center mt-5 bg-red-300">Check your inbox/spam.</h1>`
//             );
//         });
        
//     } catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// };

//  module.exports = sendmail;