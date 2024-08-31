import { create } from 'zustand';
import axios from 'axios';

const API_URL =
    import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/auth' : 'api/auth';

export const useAuthStore = create((set) => ({
    user: null,
    error: null,
    isLoading: false,
    messsage: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    signUp: async ({ email, password, name }) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/sign-up`, { email, password, name });
            set({ user: res.data.user, isLoading: false, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || 'Error signing up', isLoading: false });
            throw error;
        }
    },
}));
