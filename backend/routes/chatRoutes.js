const express = require("express");
const router = express.Router();
const { sendMessage, getChatHistory, clearChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", sendMessage);
router.get("/", getChatHistory);
router.delete("/", clearChatHistory);

module.exports = router;
