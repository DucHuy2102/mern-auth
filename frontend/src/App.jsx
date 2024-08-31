import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FloatingShape, LoadingSpinner } from './components/exportComponent';
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
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

// if user is authenticated, redirect to dashboard
const RedirectUser = ({ children }) => {
    const { user, isAuthenticated } = useAuthStore();
    if (isAuthenticated && user?.isVerified) return <Navigate to={'/'} replace />;
    return children;
};

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuthStore();
    if (!isAuthenticated) return <Navigate to={'/sign-in'} replace />;
    if (!user?.isVerified) {
        return <Navigate to={'/verify-email'} replace />;
    }
    return children;
};

export default function App() {
    const { user, isCheckingAuth, checkAuth } = useAuthStore();

    // check if user is authenticated
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

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
                    <Route
                        path='/'
                        element={
                            <ProtectedRoute>
                                <Dashboard_Page />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/sign-up'
                        element={
                            <RedirectUser>
                                <SignUp_Page />
                            </RedirectUser>
                        }
                    />
                    <Route
                        path='/sign-in'
                        element={
                            <RedirectUser>
                                <SignIn_Page />
                            </RedirectUser>
                        }
                    />
                    <Route path='/verify-email' element={<EmailVerification_Page />} />
                    <Route
                        path='/forgot-password'
                        element={
                            <RedirectUser>
                                <ForgotPassword_Page />
                            </RedirectUser>
                        }
                    />
                    <Route
                        path='/reset-password/:token'
                        element={
                            <RedirectUser>
                                <ResetPassword_Page />
                            </RedirectUser>
                        }
                    />
                </Routes>
            </Router>

            <ToastContainer />
        </div>
    );
}
