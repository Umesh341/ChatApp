import { create } from 'zustand';


import { axiosInstance } from '../lib/axios';

import toast from 'react-hot-toast';
import { io } from "socket.io-client";

const BASE_URL = "/"

export const useAuthStore = create((set, get) => ({

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,

    isCheckingAuth: true,
    onlineUsers: [],


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth", { withCredentials: true });

            set({ authUser: res.data });
           
            console.log(get().authUser);

            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }

    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data, { withCredentials: true });
            toast.success("Signup successful");
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            console.log(error.message);
            toast.error("Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data, { withCredentials: true });
            if (!res) {
                toast.error("user doesnot exist")
            }
            set({ authUser: res.data });
            set({ isLoggingIn: false });

            get().connectSocket()
            toast.success("Login successful");


        } catch (error) {
            console.log(error.message);
            toast.error("Login failed");
        }
    },

    logout: async () => {
        try {
            const isLogout = await axiosInstance.post('/auth/logout', { withCredentials: true });
            if (isLogout) {
                set({ authUser: null });
                get().disconnectSocket();
                console.log(get().authUser)
                toast.success("Logged out successfully");
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Logout failed");
        }
    },

    connectSocket: () => {
    
        const { authUser } = get();
        console.log(authUser)
        if (!authUser) { return; }

        const socket = io(BASE_URL, {
            auth: { userId: authUser._id },
        });
      
        set({ socket:socket });
        socket.on("getOnlineUsers", (uid) => { set({ onlineUsers: uid }) })

    },
    disconnectSocket: () => {
        console.log("disconnect")
        if (get().socket?.connected) get().socket.disconnect();
    }

}));