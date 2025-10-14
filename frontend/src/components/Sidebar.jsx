import React from 'react'

const Sidebar = ({ users, onlineUsers, selectedUser, setSelectedUser, getMessages }) => {

  const [isOpen, setIsOpen] = React.useState(false);
  const filteredUsers = users;
  console.log(filteredUsers);

  return (
    <>
      {/* Top-left toggle button:
          - Visible on mobile only when sidebar is closed.
          - Visible on md+ always (so desktop users can toggle).
          - z-50 keeps it above the sidebar (sidebar uses z-40)
      */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        className={`
          fixed top-16 left-64 z-50 bg-green-600 text-white p-2 md:hidden hover:bg-green-700 transition
          ${isOpen ? "md:block" : " block"}
        `}
      >
        {!isOpen ? (
          <div className="space-y-1">
            see users
          </div>
        ) : (
          <span className="text-lg font-bold">✕</span>
        )}
      </button>

      {/* Sidebar: overlay on small screens, flow on md+ */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-zinc-100 flex flex-col transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:block
        `}
        aria-hidden={!isOpen && typeof window !== "undefined" && window.innerWidth < 768}
      >

        <div className="text-lg font-semibold text-green-600 p-4 border-b border-gray-300 flex justify-between items-center">
          <span>Contacts</span>

          {/* Mobile-only close button — IMPORTANT so small screen users can close */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-600 hover:text-green-600 px-2 py-1 rounded"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-600 text-center py-6">No contacts</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  getMessages(user._id);
                  // auto-close overlay on small screens after selecting
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
                className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${selectedUser?._id === user._id ? "bg-green-500 text-white" : "hover:bg-gray-200 text-gray-800"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{user.username}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${onlineUsers.includes(user._id) ? "bg-green-600" : "bg-gray-400"}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Backdrop only on small screens when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar