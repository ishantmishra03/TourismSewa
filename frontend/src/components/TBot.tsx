import axios from "axios";
import { MessageCircle } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const cardIcons: Record<string, string> = {
  summary: "📝",
  error: "⚠️",
};

interface BotCard {
  type: "summary" | "error" | string;
  content: string;
}

interface Message {
  sender: "user" | "bot";
  content: string | BotCard[];
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setMessages((prev) => [...prev, { content: message, sender: "user" }]);
    setInputValue("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_PYTHON_BACKEND_URL}/api/query`,
        { user_input: message }
      );

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content: [
              {
                type: "error",
                content: data.error + (data.raw ? "\n" + data.raw : ""),
              },
            ],
          },
        ]);
      } else if (data.text) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", content: [{ type: "summary", content: data.text }] },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content: [{ type: "error", content: "⚠️ Backend not responding." }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg focus:outline-none transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="flex flex-col w-72 md:w-96 h-96 border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-teal-600 text-white">
            <h2 className="font-bold text-lg">Tourist Bot</h2>
            <button
              onClick={() => setOpen(false)}
              className="font-bold text-xl hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "user" ? (
                  <div className="bg-teal-600 text-white px-3 py-2 rounded-xl max-w-xs break-word shadow-sm">
                    {msg.content as string}
                  </div>
                ) : (
                  <div className="flex flex-col max-w-xs">
                    {Array.isArray(msg.content) &&
                      msg.content.map((card, cidx) => (
                        <div
                          key={cidx}
                          className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-xl mb-2 shadow-sm"
                        >
                          <div className="prose prose-sm dark:prose-invert wrap-break-word">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {`${cardIcons[card.type] || ""} ${card.content}`}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-xl shadow-sm animate-pulse">
                  <strong>📝</strong> Bot is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
