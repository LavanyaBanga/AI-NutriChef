const express = require("express");
const router = express.Router();
const {
  generateAIMealPlan,
  saveMealPlan,
  getMealPlans,
  getMealPlanById,
  deleteMealPlan,
} = require("../controllers/mealPlanController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/generate", generateAIMealPlan);
router.post("/", saveMealPlan);
router.get("/", getMealPlans);
router.get("/:id", getMealPlanById);
router.delete("/:id", deleteMealPlan);

module.exports = router;
