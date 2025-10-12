import React from 'react'


const styles = {

  sidebar: {
    width: "260px",
    backgroundColor: "#10172a",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "4px 0 12px rgba(0,0,0,0.2)",
  },

  sidebarHeader: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: 8,
  },

  contactList: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  contactItem: {
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
};
const Sidebar = ({ users, onlineUsers, selectedUser, setSelectedUser, getMessages }) => {



  const filteredUsers =  users;

    console.log(filteredUsers)

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>Contacts</div>
      <div style={styles.contactList}>
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              getMessages(user._id);
            }}

            style={{
              ...styles.contactItem,
              backgroundColor:
                selectedUser?._id === user._id ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{user.username}</span>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: onlineUsers.includes(user._id) ? "limegreen" : "gray",
                  display: "inline-block",
                  marginLeft: 8,
                }}
              ></span>
            </div>
          </div>
        ))}


      </div>
    </aside>
  )
}

export default Sidebar