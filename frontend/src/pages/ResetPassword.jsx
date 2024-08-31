import { motion } from 'framer-motion';
import { Input_Component } from '../components/exportComponent';
import { Link } from 'react-router-dom';
import { House, Loader, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export default function ResetPassword() {
    // states
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // handle change input
    const handleChangeInput = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.password || !formData.confirmPassword) {
            setError('All fields are required');
            setTimeout(() => {
                setError(null);
            }, 5000);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setTimeout(() => {
                setError(null);
            }, 5000);
            return;
        }
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
                        Reset Password
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input_Component
                        icon={Lock}
                        type='password'
                        id='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChangeInput}
                    />
                    <Input_Component
                        icon={Lock}
                        type='password'
                        id='confirmPassword'
                        placeholder='New Password'
                        value={formData.confirmPassword}
                        onChange={handleChangeInput}
                    />

                    {error && (
                        <p className='text-red-500 text-center font-semibold mb-4'>{error}</p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Set New Password'}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
