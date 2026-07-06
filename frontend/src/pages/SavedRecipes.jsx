import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import RecipeCard from "../components/RecipeCard";
import { getRecipesApi, deleteRecipeApi } from "../services/api";

const dietGoals = [
  { value: "", label: "All Diet Goals" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "balanced_diet", label: "Balanced Diet" },
  { value: "diabetes_friendly", label: "Diabetes-Friendly" },
  { value: "high_protein", label: "High-Protein" },
];

const mealTypes = ["", "Breakfast", "Lunch", "Dinner", "Snack"];

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [dietGoal, setDietGoal] = useState("");
  const [mealType, setMealType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (dietGoal) params.dietGoal = dietGoal;
      if (mealType) params.mealType = mealType;

      const res = await getRecipesApi(params);
      setRecipes(res.data.recipes);
    } catch (err) {
      setError("Failed to load your saved recipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipeApi(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      // Silent fail
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-1">📖 Saved Recipes</h1>
        <p className="text-gray-500 mb-6">Search and filter through your saved recipes.</p>

        <form onSubmit={handleFilterSubmit} className="card mb-6 grid sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by name</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              placeholder="e.g. chicken curry"
            />
          </div>
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
                  {m || "All"}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-4">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              🔍 Search
            </button>
          </div>
        </form>

        {loading ? (
          <Loader text="Loading your saved recipes..." />
        ) : error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No saved recipes found. Try generating one from the Recipe Generator page!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {recipes.map((r) => (
              <RecipeCard key={r._id} recipe={r} onDelete={() => handleDelete(r._id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedRecipes;
