import { motion } from 'framer-motion';
import { House, Loader, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input_Component } from '../components/exportComponent';
import { useAuthStore } from '../store/authStore';

export default function SignIn() {
    // state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    // form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChangeInput = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // handle login function
    const handleLogin = async (e) => {
        e.preventDefault();
        if (formData.email === '' || formData.password === '') {
            setError('All fields are required');
            setTimeout(() => {
                setError(null);
            }, 3000);
            return;
        }
        try {
            setError(null);
            setIsLoading(true);
            await login(formData);
        } catch (error) {
            console.log(error);
            setError('Failed to login');
        } finally {
            setIsLoading(false);
        }
        console.log('login');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                <div className='relative'>
                    <Link className='absolute top-2' to={'/'}>
                        <House className='text-emerald-500 cursor-pointer' size={25} />
                    </Link>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Welcome Back
                    </h2>
                </div>

                <form onSubmit={handleLogin}>
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

                    <div className='mb-4'>
                        <Link
                            to='/forgot-password'
                            className='text-sm text-green-400 hover:underline'
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {error && (
                        <p className='text-red-500 text-center font-semibold mb-4'>{error}</p>
                    )}

                    <motion.button
                        type='submit'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : 'Login'}
                    </motion.button>
                </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Don&apos;t have an account?{' '}
                    <Link to='/sign-up' className='text-green-400 hover:underline'>
                        Sign up
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
