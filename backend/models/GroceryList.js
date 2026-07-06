const mongoose = require("mongoose");

const groceryListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPlan",
    },
    title: { type: String, default: "Grocery List" },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: String, default: "" },
        category: { type: String, default: "Other" },
        checked: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroceryList", groceryListSchema);
