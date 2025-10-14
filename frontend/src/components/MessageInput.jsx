import React from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const { sendMessage } = useChatStore();

  const [text, setText] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleInputChange = (e) => setText(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handlesendMessage = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({ text, image: imagePreview });
      setText("");
      setImagePreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handlesendMessage} className="flex items-center gap-2 w-full">
        {imagePreview && (
          <div className="relative flex-shrink-0">
            <img
              src={imagePreview}
              alt="preview"
              className="w-10 h-10 object-cover rounded-none border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remove image"
              className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs shadow"
            >
              ×
            </button>
          </div>
        )}

        {/* text input - flex-1 with min-w-0 to allow shrinking on small screens */}
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={handleInputChange}
          className="flex-1 min-w-0 bg-gray-100 text-gray-900 px-3 py-2 rounded-none focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {/* Upload button (small square) */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 w-10 h-10 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition rounded-none"
          aria-label="Upload image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9M12 3v9M8 7l4-4 4 4" />
          </svg>
        </button>

        {/* Send button (small square) */}
        <button
          type="submit"
          className="flex-shrink-0 w-10 h-10 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition rounded-none"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transform rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2l-7 20  -1-7-7-1 7-12z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
