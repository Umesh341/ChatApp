import React from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInput = ({ onTypingChange }) => {
  const { sendMessage } = useChatStore();

  const [text, setText] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const [keyboardOffset, setKeyboardOffset] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );
  const blurTimeoutRef = React.useRef(null);

  // update mobile flag on resize
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // notify parent when typing changes
  React.useEffect(() => {
    if (typeof onTypingChange === "function") onTypingChange(isTyping, isMobile);
  }, [isTyping, isMobile, onTypingChange]);

  // keyboard detection (visualViewport preferred)
  React.useEffect(() => {
    const onViewportChange = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        const offset = window.innerHeight - viewport.height - (viewport.offsetTop || 0);
        setKeyboardOffset(offset > 0 ? Math.round(offset) : 0);
      } else {
        const offset = window.innerHeight - document.documentElement.clientHeight;
        setKeyboardOffset(offset > 0 ? Math.round(offset) : 0);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportChange);
      window.visualViewport.addEventListener("scroll", onViewportChange);
    } else {
      window.addEventListener("resize", onViewportChange);
    }

    onViewportChange();
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onViewportChange);
        window.visualViewport.removeEventListener("scroll", onViewportChange);
      } else {
        window.removeEventListener("resize", onViewportChange);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (!isTyping) setIsTyping(true);
    // clear any pending blur timeout so typing stays true
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

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
      // stop typing after send
      setIsTyping(false);
    } catch (err) {
      console.error(err);
    }
  };

  // when input focuses, mark typing true
  const handleFocus = (e) => {
    if (!isTyping) setIsTyping(true);
    // ensure the field scrolls into view on some mobiles
    setTimeout(() => {
      try {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (err) {}
    }, 80);
  };

  // when input blurs, delay marking not-typing to allow clicks (send/upload)
  const handleBlur = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 200); // 200ms is small but allows button press
  };

  // Hide upload button on mobile while typing:
  const showUploadButton = !(isMobile && isTyping);

  return (
    <>
      {/* Fixed bottom container lifted by keyboardOffset + safe area */}
      <div
        style={{
          bottom: `calc(${keyboardOffset}px + env(safe-area-inset-bottom))`,
          zIndex: 60,
        }}
        className="fixed left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 transition-all duration-150"
      >
        <div className="max-w-4xl mx-auto">
          {imagePreview && (
            <div className="relative block sm:inline-block mb-3 mx-auto sm:mx-0">
              <img
                src={imagePreview}
                alt="preview"
                className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg border-2 border-gray-300"
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

          {/* Form layout:
              - default on mobile: column
              - BUT when typing on mobile: single row with input(left) + send(right)
              - on sm+ screens we keep row layout
          */}
          <form
            onSubmit={handlesendMessage}
            className={`flex w-full gap-2 items-center
              ${isMobile ? (isTyping ? "flex-row" : "flex-col") : "flex-row"}
            `}
          >
            <input
              type="text"
              placeholder="Type a message"
              value={text}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full sm:flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md focus:outline-none"
              inputMode="text"
              autoComplete="off"
              autoCorrect="on"
              spellCheck={true}
            />

            {/* hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Upload button: hidden on mobile while typing */}
            {showUploadButton && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition"
                aria-label="Upload image"
              >
                Upload
              </button>
            )}

            {/* Send button: stays on right when in single-row typing mode */}
            <button
              type="submit"
              className={`${
                isMobile && isTyping ? "w-20 flex-shrink-0" : "w-full sm:w-auto"
              } bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition`}
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* spacer so page content doesn't go under the fixed input */}
      <div aria-hidden="true" className="h-20 md:h-16" />
    </>
  );
};

export default MessageInput;
