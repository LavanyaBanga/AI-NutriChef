import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import RecipeCard from "../components/RecipeCard";
import { generateRecipeApi, saveRecipeApi } from "../services/api";

const dietGoals = [
  { value: "", label: "Any / No preference" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "balanced_diet", label: "Balanced Diet" },
  { value: "diabetes_friendly", label: "Diabetes-Friendly" },
  { value: "high_protein", label: "High-Protein" },
];

const mealTypes = ["", "Breakfast", "Lunch", "Dinner", "Snack"];

const RecipeGenerator = () => {
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [dietGoal, setDietGoal] = useState("");
  const [allergies, setAllergies] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [mealType, setMealType] = useState("");

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setSaveMessage("");
    setRecipe(null);

    const ingredients = ingredientsInput
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (ingredients.length === 0) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    try {
      const allergiesArray = allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const res = await generateRecipeApi({
        ingredients,
        dietGoal,
        allergies: allergiesArray,
        cuisine,
        mealType,
      });
      setRecipe(res.data.recipe);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe) return;
    setSaving(true);
    setSaveMessage("");
    try {
      await saveRecipeApi(recipe);
      setSaveMessage("Recipe saved successfully! ✅");
    } catch (err) {
      setSaveMessage(err.response?.data?.message || "Failed to save recipe.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">🍳 AI Recipe Generator</h1>
        <p className="text-gray-500 mb-6">
          Tell us what you have, and we'll cook up a recipe idea.
        </p>

        <form onSubmit={handleGenerate} className="card space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients you have (comma separated) *
            </label>
            <input
              type="text"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              className="input-field"
              placeholder="chicken breast, rice, spinach, garlic"
              required
            />
          </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="input-field">
                {mealTypes.map((m) => (
                  <option key={m} value={m}>
                    {m || "Any"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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

          {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Generating..." : "✨ Generate Recipe"}
          </button>
        </form>

        {loading && <Loader text="Our AI chef is cooking up your recipe..." />}

        {recipe && (
          <>
            <RecipeCard recipe={recipe} onSave={handleSave} saving={saving} />
            {saveMessage && <p className="text-sm mt-2 text-primary-700">{saveMessage}</p>}
          </>
        )}
      </main>
    </div>
  );
};

export default RecipeGenerator;
