import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = (import.meta.env.MODE === 'development')
  ? 'http://localhost:3000'
  : '/';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');

      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.error('Error in checkAuth: ', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('auth/signup', formData);
      set({ authUser: response.data });
      toast.success('Account created successfully');

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      set({ authUser: response.data });
      toast.success('Logged in successfully');

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');

      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const response = await axiosInstance.put('auth/update-profile', data);
      set({ authUser: response.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    const newSocket = io(
      BASE_URL,
      {
        query: { userId: authUser._id }
      }
    );
    newSocket.connect();

    set({ socket: newSocket });

    newSocket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();

    if (socket?.connected) socket?.disconnect();
  },
}));