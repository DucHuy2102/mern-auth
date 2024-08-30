import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input_Component, PasswordStrengthMeter } from '../components/exportComponent';
import { ArrowBigLeft, Loader, Lock, Mail, User } from 'lucide-react';

export default function SignUp() {
    // state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    // handle change input value
    const handleChangeInput = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // handle sign up
    const handleSignUp = (e) => {
        e.preventDefault();
        if (formData.name === '' || formData.email === '' || formData.password === '') {
            setError('All fields are required');
            setTimeout(() => {
                setError(null);
            }, 3000);
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setTimeout(() => {
                setError(null);
            }, 3000);
            return;
        }
        try {
            setError(null);
            setFormData({ name: '', email: '', password: '' });
            console.log(formData);
        } catch (error) {
            console.log(error);
            setError('Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
    overflow-hidden'
        >
            <div className='p-8'>
                <div className='relative'>
                    <Link className='absolute top-2' to={'/'}>
                        <ArrowBigLeft className='text-emerald-500 cursor-pointer' size={25} />
                    </Link>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Create Account
                    </h2>
                </div>

                {/* form */}
                <form onSubmit={handleSignUp}>
                    <Input_Component
                        icon={User}
                        type='text'
                        id='name'
                        placeholder='Full Name'
                        value={formData.name}
                        onChange={handleChangeInput}
                    />
                    <Input_Component
                        icon={Mail}
                        type='email'
                        id='email'
                        placeholder='Email Address'
                        value={formData.email}
                        onChange={handleChangeInput}
                    />
                    <Input_Component
                        icon={Lock}
                        type='password'
                        id='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChangeInput}
                    />

                    {/* password strength meter */}
                    <PasswordStrengthMeter password={formData.password} />

                    {/* error */}
                    {error && (
                        <p className='text-red-500 text-center font-semibold mt-4'>{error}</p>
                    )}

                    {/* sign up button */}
                    <motion.button
                        className='mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader className='animate-spin mx-auto' size={24} />
                        ) : (
                            'Sign Up'
                        )}
                    </motion.button>
                </form>
            </div>

            {/* link to login page */}
            <div className='py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Already have an account?{' '}
                    <Link to={'/sign-in'} className='text-green-400 hover:underline'>
                        Login
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
