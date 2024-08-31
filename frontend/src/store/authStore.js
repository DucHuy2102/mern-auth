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

    login: async (formData) => {
        const { email, password } = formData;
        try {
            const res = await axios.post(`${API_URL}/sign-in`, { email, password });
            set({ user: res.data.user, isAuthenticated: true });
        } catch (error) {
            console.log(error);
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.get(`${API_URL}/check-auth`);
            set({ user: res.data.user, isAuthenticated: true });
        } catch (error) {
            set({ isCheckingAuth: false });
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/log-out`);
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            console.log(error);
        }
    },
}));
