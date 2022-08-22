import getMailTemplate from './mailTemplate.js';
import { mailService } from '../mail.service.js';

export default class ContactUsMail {
    async getMailResult(obj) {
        let mailTemplate = getMailTemplate(obj);

        let info = await mailService.service.sendMail({
            from: '"Product Comparify 👻"' + process.env.MAILNAME, // sender address
            to: process.env.MAILNAME, // list of receivers
            subject: 'Contact Us Message', // Subject line
            text: 'New Contact Us Alert', // plain text body
            html: mailTemplate, // html body
        });
    }
}
