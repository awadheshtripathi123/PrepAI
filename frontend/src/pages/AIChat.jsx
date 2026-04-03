import { Send, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const initialMessage = location.state?.message || "";

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg = input) => {
    if (!msg.trim()) return;

    const userMsg = { type: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await authFetch('/api/v1/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: data.data },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Error: " + data.error },
        ]);
      }
    } catch (error) {
      console.error('AI chat failed:', error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error: Could not connect to the AI service." },
      ]);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      
      {/* Background Watermark Image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] mix-blend-screen pointer-events-none z-0">
        <img src="/logo.png" alt="Background Watermark" className="w-[500px] md:w-[600px] object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.8)]" />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">

      {/* 🔙 TOP BAR */}
      <div className="flex items-center px-6 py-4">
        <ArrowLeft
          onClick={() => navigate("/ai")}
          className="text-gray-400 cursor-pointer hover:text-white transition"
        />
        <h2 className="ml-3 text-white text-sm font-semibold">
          AI Chat
        </h2>
      </div>

      {/* 💬 CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">

        <div className="max-w-3xl mx-auto space-y-6">

          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              Ask anything
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-xl text-sm ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-[#1e293b] text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={bottomRef}></div>

        </div>
      </div>

      {/* ✏️ INPUT BAR */}
      <div className="pb-6 px-4 sm:px-6">

        <div className="max-w-3xl mx-auto flex items-center bg-[#1e293b] rounded-full px-4 py-3 border border-white/10">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Message AI..."
            className="flex-1 bg-transparent outline-none text-white px-2"
          />

          <Send
            onClick={sendMessage}
            className="text-blue-400 cursor-pointer"
          />
        </div>

      </div>

      </div>

    </div>
  );
};

export default AIChat;