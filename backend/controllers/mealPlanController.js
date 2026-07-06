const MealPlan = require("../models/MealPlan");
const { generateMealPlan } = require("../utils/aiService");

// @desc   Generate a weekly meal plan using AI (not saved yet)
// @route  POST /api/mealplans/generate
// @access Private
const generateAIMealPlan = async (req, res) => {
  try {
    const { dietGoal, allergies, cuisine } = req.body;

    const aiResult = await generateMealPlan({
      dietGoal: dietGoal || "",
      allergies: allergies || [],
      cuisine: cuisine || "",
    });

    res.json({
      mealPlan: {
        title: aiResult.title || "Weekly Meal Plan",
        days: aiResult.days || [],
        dietGoal: dietGoal || "",
        allergies: allergies || [],
        cuisine: cuisine || "",
      },
    });
  } catch (error) {
    console.error("Generate meal plan error:", error.message);
    res.status(500).json({ message: error.message || "Failed to generate meal plan" });
  }
};

// @desc   Save a generated meal plan
// @route  POST /api/mealplans
// @access Private
const saveMealPlan = async (req, res) => {
  try {
    const { title, days, dietGoal, allergies, cuisine } = req.body;

    if (!days || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ message: "Meal plan days are required" });
    }

    const mealPlan = await MealPlan.create({
      user: req.user._id,
      title: title || "Weekly Meal Plan",
      days,
      dietGoal: dietGoal || "",
      allergies: allergies || [],
      cuisine: cuisine || "",
    });

    res.status(201).json({ mealPlan });
  } catch (error) {
    console.error("Save meal plan error:", error.message);
    res.status(500).json({ message: "Failed to save meal plan" });
  }
};

// @desc   Get all saved meal plans for logged-in user
// @route  GET /api/mealplans
// @access Private
const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ mealPlans });
  } catch (error) {
    console.error("Get meal plans error:", error.message);
    res.status(500).json({ message: "Failed to fetch meal plans" });
  }
};

// @desc   Get a single meal plan by id
// @route  GET /api/mealplans/:id
// @access Private
const getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    res.json({ mealPlan });
  } catch (error) {
    console.error("Get meal plan error:", error.message);
    res.status(500).json({ message: "Failed to fetch meal plan" });
  }
};

// @desc   Delete a saved meal plan
// @route  DELETE /api/mealplans/:id
// @access Private
const deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    res.json({ message: "Meal plan deleted successfully" });
  } catch (error) {
    console.error("Delete meal plan error:", error.message);
    res.status(500).json({ message: "Failed to delete meal plan" });
  }
};

module.exports = {
  generateAIMealPlan,
  saveMealPlan,
  getMealPlans,
  getMealPlanById,
  deleteMealPlan,
};
