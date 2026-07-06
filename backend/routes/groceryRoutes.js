const express = require("express");
const router = express.Router();
const {
  generateAIGroceryList,
  saveGroceryList,
  getGroceryLists,
  toggleGroceryItem,
  deleteGroceryList,
} = require("../controllers/groceryController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/generate", generateAIGroceryList);
router.post("/", saveGroceryList);
router.get("/", getGroceryLists);
router.patch("/:id/items/:itemId", toggleGroceryItem);
router.delete("/:id", deleteGroceryList);

module.exports = router;
