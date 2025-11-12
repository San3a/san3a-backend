import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: 'san3a <support@notours.io>',
            to: options.email,
            subject: options.subject,
            text: options.text,
            // html: options.html,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('EMAIL ERROR:', err);
        throw new Error('There was an error sending the email.');
    }
};

export default sendEmail;
