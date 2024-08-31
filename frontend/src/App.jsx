import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FloatingShape } from './components/exportComponent';
import {
    SignUp_Page,
    SignIn_Page,
    Dashboard_Page,
    ForgotPassword_Page,
    EmailVerification_Page,
    ResetPassword_Page,
} from './pages/exportPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    return (
        <div
            className='min-h-screen bg-gradient-to-r from-gray-800 via-green-800 to-emerald-800 
        flex justify-center items-center overflow-hidden relative'
        >
            <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
            <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
            <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

            {/* routes */}
            <Router>
                <Routes>
                    <Route path='/' element={<Dashboard_Page />} />
                    <Route path='/sign-up' element={<SignUp_Page />} />
                    <Route path='/sign-in' element={<SignIn_Page />} />
                    <Route path='/forgot-password' element={<ForgotPassword_Page />} />
                    <Route path='/verify-email' element={<EmailVerification_Page />} />
                    <Route path='/reset-password/:token' element={<ResetPassword_Page />} />
                </Routes>
            </Router>

            <ToastContainer />
        </div>
    );
}
