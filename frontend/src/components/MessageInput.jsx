import React from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const { sendMessage } = useChatStore();

  const [text, setText] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  // keyboardOffset is the number of px to lift the fixed input above the keyboard
  const [keyboardOffset, setKeyboardOffset] = React.useState(0);
  const containerRef = React.useRef(null);

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

  // --- keyboard detection: visualViewport preferred, fallback to window resize ---
  React.useEffect(() => {
    const onViewportChange = () => {
      // visualViewport gives the actual viewport height excluding keyboard on modern browsers
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        // difference between layout viewport (innerHeight) and visual viewport height is keyboard height
        const offset = window.innerHeight - viewport.height - (viewport.offsetTop || 0);
        setKeyboardOffset(offset > 0 ? Math.round(offset) : 0);
      } else {
        // fallback: approximate keyboard height as difference between innerHeight and documentElement.clientHeight
        const offset = window.innerHeight - document.documentElement.clientHeight;
        setKeyboardOffset(offset > 0 ? Math.round(offset) : 0);
      }
    };

    // listen for visualViewport resize/scroll to detect keyboard open/close
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onViewportChange);
      window.visualViewport.addEventListener("scroll", onViewportChange);
    } else {
      window.addEventListener("resize", onViewportChange);
    }

    // initial check
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

  // optional: when input focuses, scroll it into view (helps on some Android browsers)
  const handleFocus = (e) => {
    // small delay gives keyboard time to open
    setTimeout(() => {
      try {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (err) {
        /* ignore */
      }
    }, 80);
  };

  return (
    <>
      {/* The message input is fixed to the bottom and lifted by keyboardOffset + safe-area */}
      <div
        ref={containerRef}
        // inline style to add dynamic bottom offset + safe-area inset
        style={{
          bottom: `calc(${keyboardOffset}px + env(safe-area-inset-bottom))`,
          // ensure higher stacking context over content
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

          <form onSubmit={handlesendMessage} className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Type a message"
              value={text}
              onChange={handleInputChange}
              onFocus={handleFocus}
              className="w-full sm:flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              inputMode="text"
              autoComplete="off"
              autoCorrect="on"
              spellCheck={true}
            />

            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition"
              aria-label="Upload image"
            >
              Upload Image
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* spacer so page content doesn't go under the fixed input (especially important on desktop/tablet) */}
      <div aria-hidden="true" className="h-20 md:h-16" />
    </>
  );
};

export default MessageInput;
