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
        console.log('Error sending verification email:', error);
    }
};
