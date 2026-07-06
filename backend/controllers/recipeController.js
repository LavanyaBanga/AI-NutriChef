const Recipe = require("../models/Recipe");
const { generateRecipe } = require("../utils/aiService");

// @desc   Generate a recipe using AI (not saved yet)
// @route  POST /api/recipes/generate
// @access Private
const generateAIRecipe = async (req, res) => {
  try {
    const { ingredients, dietGoal, allergies, cuisine, mealType } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Please provide at least one ingredient" });
    }

    const aiResult = await generateRecipe({
      ingredients,
      dietGoal: dietGoal || "",
      allergies: allergies || [],
      cuisine: cuisine || "",
      mealType: mealType || "",
    });

    res.json({
      recipe: {
        ...aiResult,
        dietGoal: dietGoal || "",
        cuisine: cuisine || "",
        mealType: mealType || "",
        allergiesAvoided: allergies || [],
        rawInput: { ingredients, dietGoal, allergies, cuisine, mealType },
      },
    });
  } catch (error) {
    console.error("Generate recipe error:", error.message);
    res.status(500).json({ message: error.message || "Failed to generate recipe" });
  }
};

// @desc   Save a generated recipe to the database
// @route  POST /api/recipes
// @access Private
const saveRecipe = async (req, res) => {
  try {
    const recipeData = req.body;

    if (!recipeData.name) {
      return res.status(400).json({ message: "Recipe name is required to save" });
    }

    const recipe = await Recipe.create({
      user: req.user._id,
      ...recipeData,
    });

    res.status(201).json({ recipe });
  } catch (error) {
    console.error("Save recipe error:", error.message);
    res.status(500).json({ message: "Failed to save recipe" });
  }
};

// @desc   Get all saved recipes for logged-in user (supports search/filter)
// @route  GET /api/recipes
// @access Private
const getRecipes = async (req, res) => {
  try {
    const { search, dietGoal, mealType } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (dietGoal) {
      query.dietGoal = dietGoal;
    }
    if (mealType) {
      query.mealType = mealType;
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json({ recipes });
  } catch (error) {
    console.error("Get recipes error:", error.message);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// @desc   Get a single recipe by id
// @route  GET /api/recipes/:id
// @access Private
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ recipe });
  } catch (error) {
    console.error("Get recipe error:", error.message);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

// @desc   Delete a saved recipe
// @route  DELETE /api/recipes/:id
// @access Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete recipe error:", error.message);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

module.exports = { generateAIRecipe, saveRecipe, getRecipes, getRecipeById, deleteRecipe };
