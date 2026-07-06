const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    prepTime: { type: String, default: "" },
    dietGoal: { type: String, default: "" },
    cuisine: { type: String, default: "" },
    mealType: { type: String, default: "" },
    allergiesAvoided: [{ type: String }],
    rawInput: {
      ingredients: [{ type: String }],
      dietGoal: String,
      allergies: [String],
      cuisine: String,
      mealType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
