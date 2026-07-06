const mongoose = require("mongoose");

const dayPlanSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // e.g. "Monday"
    breakfast: { type: String, default: "" },
    lunch: { type: String, default: "" },
    dinner: { type: String, default: "" },
    snacks: { type: String, default: "" },
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "Weekly Meal Plan" },
    dietGoal: { type: String, default: "" },
    allergies: [{ type: String }],
    cuisine: { type: String, default: "" },
    days: [dayPlanSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
