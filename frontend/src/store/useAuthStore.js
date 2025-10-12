import { create } from 'zustand';


import axiosInstance from '../lib/axios';

import toast from 'react-hot-toast';
import { disconnect } from 'mongoose';
import { io } from "socket.io-client";

const BASE_URL =import.meta.env.MODE === "development" ? "https://localhost:5001" : "/";

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
            const user = await axiosInstance.get('/auth/check-auth', { withCredentials: true }
          );
            
            if (!user) {
                console.log("commsd")
                set({ authUser: null, isCheckingAuth: false });
                return;
            }

            if (user) {
                set({ authUser: user.data.user, isCheckingAuth: false });
                get().connectSocket()
                return;
            }
        } catch (error) {
       if (error.response && error.response.status === 401) {
      // Handle unauthorized error, e.g., redirect to login
      console.error('Authentication failed:', error);
      // Example: redirectToLogin();
    } else {
      // Handle other errors
      console.error('An error occurred:', error);
    }
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', formData, { withCredentials: true });
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

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', formData, { withCredentials: true });
            if(!res){
                toast.error("user doesnot exist")
            }
            set({ authUser: res.data });
            set({ isLoggingIn: false });
            toast.success("Login successful");

            get().connectSocket()
              

        } catch (error) {
            console.log(error.message);
            toast.error("Login failed");
        }
    },

    logout: async () => {
        try {
            const isLogout = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
            if (isLogout) {
                set({ authUser: null });
                toast.success("Logged out successfully");
                get().disconnectSocket();
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Logout failed");
        }
    },

    connectSocket: () => {

        const { authUser } = get();
      
        if (!authUser || get().socket?.connected) { return; } 

        const socket = io(BASE_URL,{
             query: {
            userId: authUser._id,
            }
        });  
        socket.connect()
        set({ socket: socket });   
        socket.on("getOnlineUsers", (uid)=>{set({onlineUsers:uid}) })

    },
    disconnectSocket: () => {
       console.log("disconnect")
        if (get().socket?.connected) get().socket.disconnect();
    }

}));