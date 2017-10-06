var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'bongkartmarketplace@gmail.com',
        pass: 'Test@1234'
    }
});

module.exports = {
    sendMail:function(sendersEmails,subject,html){
        const mailOptions = {
            from: 'BongKart <bongkartmarketplace@gmail.com>', // sender address
            to: sendersEmails.toString(), // list of receivers
            subject: subject, // Subject line
            html: html
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    }
};