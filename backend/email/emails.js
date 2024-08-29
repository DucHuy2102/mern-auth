import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
} from './emailTemplates.js';
import { mailTrapClient, sender } from './mailtrap.config.js';

// Send verification email
export const sendVerificationEmail = async (email, name, verificationToken) => {
    const recipient = [{ email }];

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

// Send welcome email
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

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetURL) => {
    const recipient = [{ email }];

    try {
        const res = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            category: 'password-reset',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{username}', name).replace(
                '{resetURL}',
                resetURL
            ),
        });
        console.log('Sending email reset password successfuly', res);
    } catch (error) {
        console.log('Error sending password reset email:', error);
        throw new Error('Error sending password reset email:', error);
    }
};

// Send password reset email
export const sendPasswordResetConfirmationEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const res = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Password reset confirmation',
            category: 'password-reset',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{username}', name),
        });
    } catch (error) {
        console.log('Error sending password reset confirmation email:', error);
        throw new Error('Error sending password reset confirmation email:', error);
    }
};
