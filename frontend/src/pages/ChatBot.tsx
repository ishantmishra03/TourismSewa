import React, { useState, useEffect, useRef, type FormEvent } from "react";
import { useAuth } from "../contexts/auth/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Sparkles, Bot, User } from "lucide-react";
import Groq from "groq-sdk";
import api from "../config/axios";

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}

interface Experience {
  _id: string;
  name: string;
  description: string;
  pricePerPerson?: number;
}

interface BookingDetails {
  experienceId?: string;
  fullName?: string;
  email?: string;
  contactNumber?: string;
  noOfPersons?: number;
  date?: string;
}

const ChatBotPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [bookingStep, setBookingStep] = useState<BookingDetails>({});
  const [awaitingBooking, setAwaitingBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
    dangerouslyAllowBrowser: true,
  });

  // Load all experiences on mount
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const { data } = await api.get("/experiences");
        setExperiences(data.experiences || []);
        addMessage({
          sender: "bot",
          content: `👋 **Welcome to the Tourism Assistant!** I can help you explore and book experiences across Nepal.\n\n🗺️ I've loaded **${data.experiences.length} experiences** across Nepal. 
\n💡 *If you want to book something, type [book] in your message.*\nExample: "I want to [book] the Pokhara Paragliding experience."`,
        });
      } catch {
        addMessage({
          sender: "bot",
          content: "⚠️ Couldn't load experiences. Please refresh.",
        });
      }
    };
    loadExperiences();
  }, []);

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const addMessage = (msg: ChatMessage) =>
    setMessages((prev) => [...prev, msg]);

  // Natural date parser
  const parseDate = (text: string): string => {
    const now = new Date();
    if (/tomorrow/i.test(text)) now.setDate(now.getDate() + 1);
    else if (/next week/i.test(text)) now.setDate(now.getDate() + 7);
    else if (/this week/i.test(text)) now.setDate(now.getDate() + 3);
    else if (/later/i.test(text)) now.setDate(now.getDate() + 14);
    return now.toISOString().split("T")[0];
  };

  // Get AI response with context
  const getAIResponse = async (query: string) => {
    try {
      const systemContext = `You are a friendly tourism assistant for Nepal. 
Here are available experiences: ${experiences
        .map((e) => `${e.name}: ${e.description}`)
        .join(", ")}. 
Guide users naturally through exploring and learning about experiences. 
Only discuss booking if user explicitly includes [book] in their message. Otherwise, just provide helpful travel or experience information.`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemContext },
          ...messages.map((m) => ({
            role:
              m.sender === "user" ? ("user" as const) : ("assistant" as const),
            content: String(m.content),
          })),
          { role: "user" as const, content: query },
        ],
      });

      return completion.choices[0]?.message?.content || "";
    } catch {
      return "⚠️ Couldn't reach the AI service.";
    }
  };

  // Handle booking details collection
  const handleBookingStep = async (text: string) => {
    if (!bookingStep.fullName) {
      setBookingStep((p) => ({ ...p, fullName: text }));
      return addMessage({
        sender: "bot",
        content: "📧 Great! What's your **email address**?",
      });
    }
    if (!bookingStep.email) {
      setBookingStep((p) => ({ ...p, email: text }));
      return addMessage({
        sender: "bot",
        content: "📞 Got it! Please provide your **contact number**.",
      });
    }
    if (!bookingStep.contactNumber) {
      setBookingStep((p) => ({ ...p, contactNumber: text }));
      return addMessage({
        sender: "bot",
        content: "👥 How many people are joining?",
      });
    }
    if (!bookingStep.noOfPersons) {
      const num = parseInt(text);
      setBookingStep((p) => ({ ...p, noOfPersons: num }));
      return addMessage({
        sender: "bot",
        content: "📅 When do you want to go? (e.g., tomorrow, next week)",
      });
    }
    if (!bookingStep.date) {
      const parsed = parseDate(text);
      const newBooking = { ...bookingStep, date: parsed };
      setBookingStep(newBooking);
      setAwaitingBooking(false);
      await createBooking(newBooking);
    }
  };

  // Create booking
  const createBooking = async (details: BookingDetails) => {
    if (!user?.id)
      return addMessage({
        sender: "bot",
        content: "⚠️ You must be logged in to book.",
      });

    try {
      setLoading(true);
      const payload = {
        tourist: user.id,
        experience: details.experienceId || selectedExp?._id,
        date: details.date,
        contactNumber: details.contactNumber,
        email: details.email,
        noOfPersons: details.noOfPersons,
        message: "Booked via AI assistant",
      };

      const { data } = await api.post("/bookings", payload);

      if (data.success) {
        addMessage({
          sender: "bot",
          content: `✅ Booking confirmed for **${
            selectedExp?.name || "your trip"
          }**! Redirecting to bookings...`,
        });
        setTimeout(() => (window.location.href = "/bookings"), 2000);
      } else {
        addMessage({
          sender: "bot",
          content: `⚠️ Booking failed: ${data.message}`,
        });
      }
    } catch {
      addMessage({ sender: "bot", content: "⚠️ Server error during booking." });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input.trim();
    addMessage({ sender: "user", content: text });
    setInput("");

    if (awaitingBooking) return handleBookingStep(text);

    const lowerText = text.toLowerCase();

    // Only allow booking if user includes [book]
    if (lowerText.includes("[book]")) {
      const match = experiences.find((e) =>
        lowerText.includes(e.name.toLowerCase().split(" ")[0])
      );

      if (match) {
        setSelectedExp(match);
        setAwaitingBooking(true);
        setBookingStep({ experienceId: match._id });
        return addMessage({
          sender: "bot",
          content: `🏞️ **${match.name}** sounds amazing! 🌄 Let's book it.\n\nWhat's your **full name**?`,
        });
      } else {
        return addMessage({
          sender: "bot",
          content: "⚠️ Please mention the experience name you want to [book].",
        });
      }
    }

    // Otherwise just chat normally
    const aiResponse = await getAIResponse(text);
    addMessage({ sender: "bot", content: aiResponse });
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-slate-50 via-teal-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-teal-400 to-cyan-400 rounded-full blur-md opacity-50 animate-pulse"></div>
              <div className="relative bg-linear-to-br from-teal-500 to-cyan-600 p-2.5 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Tourism AI Assistant
            </h1>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 sm:gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              {/* Avatar */}
              <div
                className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md ${
                  msg.sender === "user"
                    ? "bg-linear-to-br from-teal-500 to-cyan-600"
                    : "bg-linear-to-br from-purple-500 to-pink-500"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                    msg.sender === "user"
                      ? "bg-linear-to-br from-teal-500 to-cyan-600 text-white rounded-br-md"
                      : "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 rounded-bl-md"
                  }`}
                >
                  <div
                    className={`prose prose-sm sm:prose-base max-w-none ${
                      msg.sender === "user"
                        ? "prose-invert"
                        : "dark:prose-invert"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 shadow-md backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Assistant is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  awaitingBooking
                    ? "Enter booking details..."
                    : "Ask about experiences or type [book] to book..."
                }
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 p-3 sm:p-3.5 bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white rounded-full shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
