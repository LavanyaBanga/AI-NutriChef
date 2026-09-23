const Chat = require("../models/Chat");
const { generateChatReply } = require("../utils/aiService");

// @desc   Send a message to the AI nutrition chatbot and save the conversation
// @route  POST /api/chat
// @access Private
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }

    const aiReply = await generateChatReply({
      history: chat.messages,
      message,
    });

    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    res.json({ reply: aiReply, chat });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ message: error.message || "Failed to get chatbot reply" });
  }
};

// @desc   Get the logged-in user's chat history
// @route  GET /api/chat
// @access Private
const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user._id });
    res.json({ chat: chat || { messages: [] } });
  } catch (error) {
    console.error("Get chat history error:", error.message);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

// @desc   Clear the logged-in user's chat history
// @route  DELETE /api/chat
// @access Private
const clearChatHistory = async (req, res) => {
  try {
    await Chat.findOneAndUpdate(
      { user: req.user._id },
      { messages: [] },
      { upsert: true }
    );
    res.json({ message: "Chat history cleared" });
  } catch (error) {
    console.error("Clear chat history error:", error.message);
    res.status(500).json({ message: "Failed to clear chat history" });
  }
};

module.exports = { sendMessage, getChatHistory, clearChatHistory };
