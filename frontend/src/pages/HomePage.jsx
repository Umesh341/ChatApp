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
  const {onlineUsers, authUser} = useAuthStore();
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

}, [selectedUser?._id, getMessages, getUsers, subscribeToMessages, unsuscribeFromMessages,]);


useEffect(()=>{
  if(messageEndRef.current && messages){
  messageEndRef.current.scrollIntoView({behavior: "smooth"})
  }
},[messages])

  return (
     <div className="flex h-[calc(100vh-4rem)]">
   
      {/* Sidebar */}
     <Sidebar  users={users} onlineUsers={onlineUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser}  getMessages={getMessages}   />

      {/* Chat container */}
  <main className="flex-1 flex flex-col bg-white-600 text-white">
  {selectedUser ? (
    <>
      {/* Chat Header */}
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onlineUsers={onlineUsers}
     
      />

      {/* Messages Area */}
     {/* Messages area */}
<div
  className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
  id="messagesContainer"
>
  {messages.map((msg, index) => {
    // keep your existing logic for determining "own" message
    const isOwn = msg.senderId !== selectedUser?._id;

    return (
      <div key={index} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div
          className={`
            max-w-[80%] sm:max-w-[70%] md:max-w-md lg:max-w-lg
            p-3 rounded-1xl break-words
            ${isOwn ? "bg-zinc-400 text-gray-800" : "bg-zinc-200 text-gray-700"}
          `}
        >
          <p className="whitespace-pre-wrap">{msg.text}</p>

          {/* Responsive image */}
          {msg.image && (
            <img
              src={msg.image}
              alt="Attachment"
              loading="lazy"
              onLoad={() => {
                // optional: scroll again after image loads so the newest message stays visible
                if (messageEndRef?.current) {
                  messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
                }
              }}
              className="mt-2 rounded-lg w-full max-w-[400px] h-auto object-cover"
            />
          )}
        </div>
      </div>
    );
  })}

  {/* Scroll sentinel: place the ref here — not on every message */}
  <div ref={messageEndRef} />
</div>


      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <MessageInput/>
      </div>
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      <h2>Select a user to start chatting</h2>
    </div>
  )}
</main>

    </div>
);
}
