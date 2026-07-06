import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import { generateMealPlanApi, saveMealPlanApi } from "../services/api";

const dietGoals = [
  { value: "", label: "Any / No preference" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "balanced_diet", label: "Balanced Diet" },
  { value: "diabetes_friendly", label: "Diabetes-Friendly" },
  { value: "high_protein", label: "High-Protein" },
];

const MealPlanner = () => {
  const [dietGoal, setDietGoal] = useState("");
  const [allergies, setAllergies] = useState("");
  const [cuisine, setCuisine] = useState("");

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setSaveMessage("");
    setMealPlan(null);
    setLoading(true);

    try {
      const allergiesArray = allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const res = await generateMealPlanApi({ dietGoal, allergies: allergiesArray, cuisine });
      setMealPlan(res.data.mealPlan);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!mealPlan) return;
    setSaving(true);
    setSaveMessage("");
    try {
      await saveMealPlanApi(mealPlan);
      setSaveMessage("Meal plan saved! You can now generate a grocery list from it. ✅");
    } catch (err) {
      setSaveMessage(err.response?.data?.message || "Failed to save meal plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-1">📅 Weekly Meal Planner</h1>
        <p className="text-gray-500 mb-6">Generate a full 7-day meal plan tailored to your goals.</p>

        <form onSubmit={handleGenerate} className="card space-y-4 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diet Goal</label>
              <select value={dietGoal} onChange={(e) => setDietGoal(e.target.value)} className="input-field">
                {dietGoals.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Preference</label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="input-field"
                placeholder="Italian, Indian, Mexican..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies / avoid (comma separated)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="input-field"
              placeholder="peanuts, dairy"
            />
          </div>

          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Generating..." : "✨ Generate Weekly Plan"}
          </button>
        </form>

        {loading && <Loader text="Planning your week of meals..." />}

        {mealPlan && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{mealPlan.title}</h2>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
                {saving ? "Saving..." : "💾 Save Plan"}
              </button>
            </div>
            {saveMessage && <p className="text-sm mb-3 text-primary-700">{saveMessage}</p>}

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-2 pr-3">Day</th>
                    <th className="py-2 pr-3">Breakfast</th>
                    <th className="py-2 pr-3">Lunch</th>
                    <th className="py-2 pr-3">Dinner</th>
                    <th className="py-2 pr-3">Snacks</th>
                  </tr>
                </thead>
                <tbody>
                  {mealPlan.days.map((d, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 pr-3 font-medium">{d.day}</td>
                      <td className="py-2 pr-3 text-gray-600">{d.breakfast}</td>
                      <td className="py-2 pr-3 text-gray-600">{d.lunch}</td>
                      <td className="py-2 pr-3 text-gray-600">{d.dinner}</td>
                      <td className="py-2 pr-3 text-gray-600">{d.snacks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MealPlanner;
