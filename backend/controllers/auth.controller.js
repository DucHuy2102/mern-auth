import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../mailtrap/emails.js';

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
    res.send('Sign in route');
};

// log-out route
export const logOut = async (req, res) => {
    res.send('Log out route');
};
