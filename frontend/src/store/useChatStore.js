import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";
import { data } from "react-router-dom";
import {useAuthStore} from "./useAuthStore"

export const useChatStore = create((set,get) => ({
    messages:[{text:"sdfs"}],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
  

    getUsers : async () => {
        set({isUserLoading:true});
        try {
            const response = await axiosInstance.get("/messages/users"); 
            console.log("response")
            console.log(response)
            

          set({ users: response.data });

        } catch (error) {
            toast.error("Failed to fetch users");
        }finally
        {
            set({isUserLoading:false}); 
        }
    },

    getMessages: async (userId) => {
  
    if (!userId) {
        // console.error("No userId provided to getMessages");   only for dev c
        return;
    }        
    else{
        console.log(userId)
    }
    set({isMessageLoading:true});  
        const userToChatId = userId;
        try {
            const response = await axiosInstance.get(`/messages/${userToChatId}`);
            set({messages: response.data, isMessageLoading:false});
        }       


        catch (error) {
            toast.error("Failed to fetch messages");
        }   finally{
            set({isMessageLoading:false}); 
        }   
    },  
    sendMessage: async (messageData)  => {
        const {selectedUser, messages} = get();
         
   
        try {
         const response =  await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
           console.log(response)
            // append new message to messages array
            set({messages: [...messages, response.data]});
             toast.success("messages send");
             return
          
        } catch (error){
            toast.error("Failed to send message");
            
        }
    },
    subscribeToMessages:()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket  = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) {return}
            set({messages: [...get().messages,newMessage]})
        })
    },
    unsuscribeFromMessages :()=>{
        const socket  = useAuthStore.getState().socket;
        socket.off("newMessage");

    },


    setSelectedUser: (selectedUser) => set({selectedUser})
}));

