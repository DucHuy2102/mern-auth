import { create } from 'zustand';
import axios from 'axios';

const API_URL =
    import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/auth' : 'api/auth';

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    messsage: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    signUp: async (formData) => {
        const { name, email, password } = formData;
        try {
            const res = await axios.post(`${API_URL}/sign-up`, { email, password, name });
            set({ user: res.data.user, isAuthenticated: true });
        } catch (error) {
            console.log(error);
        }
    },

    verifyEmail: async (code) => {
        try {
            const res = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: res.data.user, isAuthenticated: true });
        } catch (error) {
            console.log(error);
        }
    },
}));
