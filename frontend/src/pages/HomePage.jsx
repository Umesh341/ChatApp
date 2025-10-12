// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { use } from "react";
import { renderMatches } from "react-router-dom";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import Sidebar from "../components/Sidebar.jsx";
import ChatHeader from "../components/ChatHeader.jsx";
import MessageInput from "../components/MessageInput.jsx";


export default function Home() {

  const [inputValue, setInputValue] = useState("");
  const messageEndRef = useRef(null)

  const {getUsers, users, isUserLoading, isMessageLoading, messages, selectedUser ,setSelectedUser,getMessages, disconnectSocket, subscribeToMessages,unsuscribeFromMessages} = useChatStore();
  const {onlineUsers} = useAuthStore();
  useEffect(() => {
    getUsers();
  if (!selectedUser?._id) return;
  getMessages(selectedUser._id);

  // Subscribe to incoming messages
  subscribeToMessages();

  // Fetch messages for the selected user

  // Optionally fetch user list (if needed each time)

  // Cleanup when component unmounts or dependencies change
  return () => {
    unsuscribeFromMessages();
  };

}, [selectedUser?._id, getMessages, getUsers, subscribeToMessages, unsuscribeFromMessages]);


useEffect(()=>{
  if(messageEndRef.current && messages){
  messageEndRef.current.scrollIntoView({behavior: "smooth"})
  }
},[messages])
  const styles = {
    container: {
      display: "flex",
      height: "91vh",
      background: "linear-gradient(180deg, #0f1724, #081023 80%)",
      color: "#e6eef8",
      fontFamily:
        'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      overflow: "hidden",
    },

 

    chatContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "#0b1220",
      padding: 20,
    },

    messagesArea: {
      flex: 1,
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      paddingRight: 10,
      marginBottom: 12,
    },

    messageBubble: {
      alignSelf: "flex-start",
      background: "#1e293b",
      padding: "10px 14px",
      borderRadius: 10,
      maxWidth: "70%",
      lineHeight: 1.4,
      wordBreak: "break-word",
    },

    ownMessage: {
      alignSelf: "flex-end",
      background: "#4f46e5",
      color: "#fff",
    },

    inputArea: {
      display: "flex",
      gap: 10,
      borderTop: "1px solid rgba(255,255,255,0.08)",
      paddingTop: 12,
      marginTop: 10,
    },

    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: "rgba(255,255,255,0.05)",
      color: "#e6eef8",
      fontSize: "0.95rem",
      outline: "none",
    },

    sendButton: {
      background: "linear-gradient(90deg, #4f46e5, #06b6d4)",
      border: "none",
      color: "#fff",
      borderRadius: 8,
      padding: "10px 16px",
      cursor: "pointer",
      fontWeight: 500,
      transition: "opacity .15s ease, transform .1s ease",
    },
  };

  return (
    <div style={styles.container}>
   
      {/* Sidebar */}
     <Sidebar  users={users} onlineUsers={onlineUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser}  getMessages={getMessages}   />

      {/* Chat container */}


      <main style={styles.chatContainer}>

        { selectedUser ? (<>
          <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser} onlineUsers={onlineUsers} disconnectSocket={disconnectSocket}/>
           
 
         
        <div style={styles.messagesArea}>
          {messages.map((msg, index) => (
           <div  key={index}
              style={{
                ...styles.messageBubble,
                ...(msg.senderId !== selectedUser._id  ? styles.ownMessage : {}),
              }}
              ref={messageEndRef} >
            <div
             
            >
              <p>{msg.text}</p>
            
                
               { msg.image && (
  <img 
    src={msg.image} 
    alt="Message attachment" 
    style={{
      width:"400px",
      height: "auto"
    }}
      loading="lazy"
    ></img>
  )}
            </div>
              
           
</div>
          ))}
        </div> 

          <MessageInput />

          </>

        ) : (
          <div style={{textAlign: "center", marginTop: "20%"}}>
            <h2 >Select a user to start chatting</h2>
          </div>
        )}

        {/* Textbox + Send */}
       
      </main>
    </div>
);
}
