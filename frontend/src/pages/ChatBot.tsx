import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useAuth } from "../contexts/auth/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Sparkles } from "lucide-react";
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
          content: `👋 **Welcome to the Tourism Assistant!** I can help you find and book experiences across Nepal.\n\n🗺️ I’ve loaded **${data.experiences.length} experiences** across Nepal. What would you like to explore today?`,
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
      const systemContext = `You are a friendly tourism booking assistant for Nepal. 
Here are available experiences: ${experiences
        .map((e) => `${e.name}: ${e.description}`)
        .join(", ")}. 
Guide users naturally through exploring and booking experiences. 
If user says 'book', gather their name, email, contact, number of persons, and rough date (like tomorrow or next week). 
Keep responses conversational and short.`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemContext },
          ...messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.content,
          })),
          { role: "user", content: query },
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
    if (!user?._id && !user?.id)
      return addMessage({
        sender: "bot",
        content: "⚠️ You must be logged in to book.",
      });

    try {
      setLoading(true);
      const payload = {
        tourist: user._id || user.id,
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

    // Check if user wants to book a known experience
    const match = experiences.find((e) =>
      text.toLowerCase().includes(e.name.toLowerCase().split(" ")[0])
    );

    if (match) {
      setSelectedExp(match);
      setAwaitingBooking(true);
      setBookingStep({ experienceId: match._id });
      return addMessage({
        sender: "bot",
        content: `🏞️ **${match.name}** sounds amazing! 🌄 Let's book it.\n\nWhat's your **full name**?`,
      });
    }

    // Otherwise, let AI assist
    const aiResponse = await getAIResponse(text);
    addMessage({ sender: "bot", content: aiResponse });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="p-4 flex items-center justify-center bg-teal-600 dark:bg-teal-500 text-white shadow-md">
        <Sparkles size={18} className="mr-2" />
        <h1 className="font-semibold text-lg">Tourism AI Assistant</h1>
      </header>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl text-sm shadow-md leading-relaxed max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-teal-600 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 dark:text-gray-400 text-sm italic animate-pulse">
            Assistant is thinking...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            awaitingBooking
              ? "Enter booking details..."
              : "Ask or search experiences..."
          }
          className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          className="p-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white rounded-full"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatBotPage;
