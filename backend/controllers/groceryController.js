const GroceryList = require("../models/GroceryList");
const MealPlan = require("../models/MealPlan");
const { generateGroceryList } = require("../utils/aiService");

// @desc   Generate a grocery list from a saved meal plan using AI
// @route  POST /api/grocery/generate
// @access Private
const generateAIGroceryList = async (req, res) => {
  try {
    const { mealPlanId } = req.body;

    if (!mealPlanId) {
      return res.status(400).json({ message: "mealPlanId is required" });
    }

    const mealPlan = await MealPlan.findOne({ _id: mealPlanId, user: req.user._id });
    if (!mealPlan) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    const mealPlanText = mealPlan.days
      .map(
        (d) =>
          `${d.day}: Breakfast - ${d.breakfast}; Lunch - ${d.lunch}; Dinner - ${d.dinner}; Snacks - ${d.snacks}`
      )
      .join("\n");

    const aiResult = await generateGroceryList({ mealPlanText });

    res.json({
      groceryList: {
        title: aiResult.title || "Grocery List",
        items: aiResult.items || [],
        mealPlan: mealPlan._id,
      },
    });
  } catch (error) {
    console.error("Generate grocery list error:", error.message);
    res.status(500).json({ message: error.message || "Failed to generate grocery list" });
  }
};

// @desc   Save a generated grocery list
// @route  POST /api/grocery
// @access Private
const saveGroceryList = async (req, res) => {
  try {
    const { title, items, mealPlan } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Grocery items are required" });
    }

    const groceryList = await GroceryList.create({
      user: req.user._id,
      title: title || "Grocery List",
      items,
      mealPlan: mealPlan || undefined,
    });

    res.status(201).json({ groceryList });
  } catch (error) {
    console.error("Save grocery list error:", error.message);
    res.status(500).json({ message: "Failed to save grocery list" });
  }
};

// @desc   Get all saved grocery lists for logged-in user
// @route  GET /api/grocery
// @access Private
const getGroceryLists = async (req, res) => {
  try {
    const groceryLists = await GroceryList.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ groceryLists });
  } catch (error) {
    console.error("Get grocery lists error:", error.message);
    res.status(500).json({ message: "Failed to fetch grocery lists" });
  }
};

// @desc   Toggle checked state of an item in a grocery list
// @route  PATCH /api/grocery/:id/items/:itemId
// @access Private
const toggleGroceryItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const groceryList = await GroceryList.findOne({ _id: id, user: req.user._id });

    if (!groceryList) {
      return res.status(404).json({ message: "Grocery list not found" });
    }

    const item = groceryList.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.checked = !item.checked;
    await groceryList.save();

    res.json({ groceryList });
  } catch (error) {
    console.error("Toggle grocery item error:", error.message);
    res.status(500).json({ message: "Failed to update item" });
  }
};

// @desc   Delete a saved grocery list
// @route  DELETE /api/grocery/:id
// @access Private
const deleteGroceryList = async (req, res) => {
  try {
    const groceryList = await GroceryList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!groceryList) {
      return res.status(404).json({ message: "Grocery list not found" });
    }
    res.json({ message: "Grocery list deleted successfully" });
  } catch (error) {
    console.error("Delete grocery list error:", error.message);
    res.status(500).json({ message: "Failed to delete grocery list" });
  }
};

module.exports = {
  generateAIGroceryList,
  saveGroceryList,
  getGroceryLists,
  toggleGroceryItem,
  deleteGroceryList,
};
