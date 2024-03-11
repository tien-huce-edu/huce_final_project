require("dotenv").config()
import nodemailer, { Transporter } from "nodemailer"
import ejs from "ejs"
import path from "path"

interface EmailOptions {
    email: string
    subject: string
    template: string
    data: { [key: string]: any }
}

const sendMail = async ({ email, subject, template, data }: EmailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    // get template mail file
    const templatePath = path.join(__dirname, `../mails`, template)
    // render template mail
    const html = await ejs.renderFile(templatePath, data)

    // Mail options
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject,
        html
    }

    // send mail
    await transporter.sendMail(mailOptions)
}

export default sendMail
