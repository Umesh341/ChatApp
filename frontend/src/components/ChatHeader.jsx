import React from 'react'

const ChatHeader = ({ selectedUser, onlineUsers ,setSelectedUser }) => {
   

 

  return (
 <>
   <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-3 px-4 mt-1">
  {/* User Info */}
  <div>
    <h2 className="text-green-700 font-semibold text-lg">
      {selectedUser?.username || "Select a user"}
    </h2>
    <p
      className={`text-sm ${
        onlineUsers.includes(selectedUser?._id)
          ? "text-green-500"
          : "text-gray-400"
      }`}
    >
      {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
    </p>
  </div>

  {/* Close Button */}
  {selectedUser && (
    <button
      onClick={() => setSelectedUser(null)}
      className="ml-3 px-2 py-1 text-gray-400 hover:text-green-500 hover:bg-gray-800 rounded-lg transition"
      aria-label="Close chat"
    >
      ✖
    </button>
  )}
</div>

  </>
  )
}

export default ChatHeader