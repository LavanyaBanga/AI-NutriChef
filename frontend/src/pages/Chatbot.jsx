import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { sendChatMessageApi, getChatHistoryApi, clearChatHistoryApi } from "../services/api";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getChatHistoryApi();
        setMessages(res.data.chat.messages || []);
      } catch (err) {
        // Ignore; start with empty chat
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await sendChatMessageApi(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get a reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearChatHistoryApi();
      setMessages([]);
    } catch (err) {
      // Silent fail
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 max-w-3xl flex flex-col h-[calc(100vh-57px)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">💬 Nutrition Chatbot</h1>
            <p className="text-gray-500 text-sm">Ask anything about food, nutrition, or recipes.</p>
          </div>
          <button onClick={handleClear} className="btn-secondary text-xs">
            Clear Chat
          </button>
        </div>

        <div className="card flex-1 overflow-y-auto mb-4 space-y-3">
          {loadingHistory ? (
            <p className="text-sm text-gray-400 text-center">Loading chat history...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">
              👋 Say hi! Ask me about recipes, calories, or healthy eating.
            </p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-primary-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-2xl rounded-bl-sm text-sm">
                Typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-2">{error}</div>}

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            placeholder="Ask about a recipe or nutrition fact..."
          />
          <button type="submit" disabled={loading} className="btn-primary">
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chatbot;
