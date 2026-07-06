const express = require("express");
const router = express.Router();
const {
  generateAIRecipe,
  saveRecipe,
  getRecipes,
  getRecipeById,
  deleteRecipe,
} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/generate", generateAIRecipe);
router.post("/", saveRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.delete("/:id", deleteRecipe);

module.exports = router;
