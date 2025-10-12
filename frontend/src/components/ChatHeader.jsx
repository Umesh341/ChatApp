import React from 'react'

const ChatHeader = ({ selectedUser, onlineUsers ,setSelectedUser }) => {
   

 

  return (
  <>
    <div style={{display: 'flex', alignItems: 'center' , justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid gray', margin: '10px'}}>
      <> <div>
        <h2 style={{color: 'white'}} >{selectedUser?.username} </h2> <p>{onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}</p> 
       </div>
        </>
      <button onClick={() =>{setSelectedUser(null); }} style={{ marginLeft: 8, display: "inline-block", cursor: "pointer" }}   >✖</button>
     

    </div>
  </>
  )
}

export default ChatHeader