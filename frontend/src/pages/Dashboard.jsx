import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className='flex flex-col items-center gap-y-10'>
            <span>Dashboard</span>
            <Link
                className='border border-gray-500 px-5 py-2 rounded-xl hover:text-white hover:bg-green-500 hover:border-green-500 transition duration-100'
                to='/sign-up'
            >
                Sign Up
            </Link>
            <Link
                className='border border-gray-500 px-5 py-2 rounded-xl hover:text-white hover:bg-green-500 hover:border-green-500 transition duration-100'
                to='/sign-in'
            >
                Sign In
            </Link>
        </div>
    );
}
