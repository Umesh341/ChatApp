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
    <div>

  {imagePreview && (
  <div style={{ position: "relative", display: "inline-block", marginBottom: "10px" }}>
    <img
      src={imagePreview}
      alt="preview"
      style={{
        width: "120px",
        height: "120px",
        objectFit: "cover",
        borderRadius: "10px",
        border: "2px solid #ccc",
      }}
    />
    <button
      onClick={removeImage}
      style={{
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      ×
    </button>
  </div>
)}

      <form action="" onSubmit={handlesendMessage}>
         
      <input type="text" placeholder='type messages' value={text} onChange={(e)=> setText(e.target.value)} />
     

  <input
    type="file"
    ref={fileInputRef}
    onChange={handleImageChange}
    style={{ display: "none" }}
  />

  <button
  type='button'

    onClick={() => fileInputRef.current?.click()}
    style={{
      backgroundColor: "#ff4d4d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "8px 16px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s ease",
    }}
    >
  
    Upload Image
  </button>

  <button type="submit" > Send </button>



     

      </form>
      </div>
  )
}

export default MessageInput