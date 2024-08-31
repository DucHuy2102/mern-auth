import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { House } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

export default function EmailVerification() {
    // states
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { verifyEmail } = useAuthStore();

    // input refs
    const inputRefs = useRef([]);

    // auto focus first input
    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    // handle change function
    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        setCode((prev) => {
            const newCode = [...prev];
            newCode[index] = value;
            return newCode;
        });
        if (value && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // handle key down function
    const handleKeyDown = (index, e) => {
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (
            (e.key === ' ' || e.key === 'ArrowRight') &&
            index < code.length - 1 &&
            code[index] !== ''
        ) {
            inputRefs.current[index + 1].focus();
        }
    };

    // handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            setIsLoading(true);
            await verifyEmail(verificationCode);
            toast.success('Email verified successfully');
            navigate('/');
        } catch (error) {
            setError('Invalid verification code');
            console.log(error);
            setTimeout(() => {
                setError(null);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
            >
                <div className='relative'>
                    <Link className='absolute top-2' to={'/'}>
                        <House className='text-emerald-500 cursor-pointer' size={25} />
                    </Link>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Create Account
                    </h2>
                </div>
                <p className='text-center text-gray-300 mb-6'>
                    Enter the 6-digit code sent to your email address.
                </p>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='flex justify-between items-center'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type='text'
                                value={digit}
                                maxLength={1}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
                            />
                        ))}
                    </div>
                    {error && (
                        <p className='text-red-500 text-center font-semibold mt-2'>{error}</p>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type='submit'
                        disabled={isLoading || code.some((digit) => !digit)}
                        className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
