import React from 'react'
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';


const MessageInput = () => {

  const {sendMessage} = useChatStore();
  
  const [text, setText] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);
  }
  const handleImageChange = (e) =>{
    const file = e.target.files[0]
    if(!file.type.startsWith("image/")){
      toast.error("plx select image")
      return;
    }

    const reader = new FileReader();
    reader.onloadend =() =>{
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file);
  }
  const removeImage = () => {
    setImagePreview(null);  
    fileInputRef.current.value = null;
  }

  const handlesendMessage = async (e) => {
    e.preventDefault();

  
    try {
      const res =  await sendMessage({
        text: text,
        image: imagePreview
      })
      setText("")
      setImagePreview(null)

    } catch (error) {
      console.log(error.message);
      
    }
  }

  return (
  <div className="w-full">
  {imagePreview && (
    <div className="relative block sm:inline-block mb-3 mx-auto sm:mx-0">
      <img
        src={imagePreview}
        alt="preview"
        className="w-20 h-20 sm:w-28 sm:h-28 object-cover  border-2 border-gray-300"
      />
      <button
        onClick={removeImage}
        aria-label="Remove image"
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition"
      >
        ×
      </button>
    </div>
  )}

  <form
    onSubmit={handlesendMessage}
    className="flex flex-col sm:flex-row items-center gap-2 w-full"
  >
    <input
      type="text"
      placeholder="Type a message"
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="w-full sm:flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 px-3 py-2 focus:outline-none "
    />

    {/* hidden file input */}
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleImageChange}
      className="hidden"
    />

    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="w-full sm:w-auto bg-gray-700 text-white px-3 py-2  hover:bg-gray-600 transition"
      aria-label="Upload image"
    >
      Upload Image
    </button>

    <button
      type="submit"
      className="w-full sm:w-auto bg-green-600 text-white px-4 py-2  hover:bg-green-700 transition"
      aria-label="Send message"
    >
      Send
    </button>
  </form>
</div>

  )
}

export default MessageInputa