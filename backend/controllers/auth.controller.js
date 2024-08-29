import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../email/emails.js';

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
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
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
