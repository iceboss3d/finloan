import * as sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API);
const mailer = {
    send(from: emailJSON, personalizations: mailerPersonalization[], dynamicTemplateData: object, templateId: string) {
        sgMail.send({ from, personalizations, dynamicTemplateData, templateId })
    }
}

export interface mailerPersonalization {
    to: emailJSON | emailJSON[];
    subject?: string;
}

export type emailJSON = {
    name?: string;
    email: string;
}

export {mailer};