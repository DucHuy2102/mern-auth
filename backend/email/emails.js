import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
import { mailTrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (email, name, verificationToken) => {
    const recipient = [{ email, name }];

    try {
        const res = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Email verification',
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{username}', name).replace(
                '{verificationCode}',
                verificationToken
            ),
            category: 'email-verification',
        });
        console.log('Email sent successfully', res);
    } catch (error) {
        console.error(`Error sending verification email`, error);
        throw new Error('Error sending verification email:', error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const res = await mailTrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: 'ce8e479b-c5ac-4fbe-a58f-ffa9742afd8f',
            template_variables: {
                company_info_name: 'dHuy Authentication',
                name: name,
            },
        });
        console.log('Welcome email sent successfully', res);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error('Error sending welcome email:', error);
    }
};
