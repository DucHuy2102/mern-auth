import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import {
    sendPasswordResetConfirmationEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from '../email/emails.js';

// sign-up route
export const signUp = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if all fields are provided
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // verify token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        const savedUser = await newUser.save();

        // jwt token
        generateTokenAndSetCookie(res, res._id);

        // send verification email
        await sendVerificationEmail(savedUser.email, savedUser.name, verificationToken);

        const { password: pass, ...rest } = savedUser._doc;
        res.status(201).json({
            suscess: true,
            message: 'User created successfully',
            user: rest,
        });
    } catch (error) {
        console.log('Error SignUp BE:', error);
    }
};

// sign-in route
export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found!' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: 'Please verify your email!' });
        }

        // Check if password is correct
        const passwordValid = await bcryptjs.compare(password, user.password);
        if (!passwordValid) {
            return res.status(400).json({ success: false, message: 'Wrong password!' });
        }

        // jwt token
        generateTokenAndSetCookie(res, user._id);

        // Update last login
        user.lastLogin = new Date();

        // Save user to db and send response
        await user.save();
        const { password: pass, ...rest } = user._doc;
        res.status(200).json({
            success: true,
            message: 'Sign in successfully',
            user: rest,
        });
    } catch (error) {
        console.log('Error SignIn BE:', error);
        res.status(500).json({ success: false, message: 'Error SignIn BE' });
    }
};

// log-out route
export const logOut = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ success: false, message: 'User not logged in' });
    } else {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
};

// verify email route
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'Invalid or expired verification token' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        const { password: pass, ...rest } = user._doc;
        res.status(200).json({ success: true, message: 'Email verified successfully', user: rest });
    } catch (error) {
        console.log('Error Verify Email BE:', error);
        res.status(500).json({ success: false, message: 'Error Verify Email BE' });
    }
};

// forgot password route
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found!' });
        }

        // generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000;

        // Save reset token and expiry time to db
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send password reset email
        await sendPasswordResetEmail(
            user.email,
            user.name,
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );

        // Send response
        res.status(200).json({ success: true, message: 'Password reset email sent successfully' });
    } catch (error) {
        console.log('Error Forgot Password BE:', error);
        res.status(500).json({ success: false, message: 'Error Forgot Password BE' });
    }
};

// reset password route
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found!' });
        }

        // hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Update user password and remove reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        // send password reset confirmation email
        await sendPasswordResetConfirmationEmail(user.email, user.name);

        // Send response
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.log('Error Reset Password BE:', error);
        res.status(500).json({ success: false, message: 'Error Reset Password BE' });
    }
};

// check authentification route
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found!!!' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log('Error Check Auth BE:', error);
        res.status(500).json({ success: false, message: 'Error Check Auth BE' });
    }
};
