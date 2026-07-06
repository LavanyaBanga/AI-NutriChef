import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  getMealPlansApi,
  generateGroceryListApi,
  saveGroceryListApi,
  getGroceryListsApi,
  toggleGroceryItemApi,
  deleteGroceryListApi,
} from "../services/api";

const GroceryList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState("");
  const [groceryList, setGroceryList] = useState(null);
  const [savedLists, setSavedLists] = useState([]);

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const loadData = async () => {
    setLoadingPlans(true);
    try {
      const [plansRes, listsRes] = await Promise.all([getMealPlansApi(), getGroceryListsApi()]);
      setMealPlans(plansRes.data.mealPlans);
      setSavedLists(listsRes.data.groceryLists);
    } catch (err) {
      setError("Failed to load your meal plans.");
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedMealPlan) {
      setError("Please select a saved meal plan first.");
      return;
    }
    setError("");
    setSaveMessage("");
    setGenerating(true);
    setGroceryList(null);
    try {
      const res = await generateGroceryListApi({ mealPlanId: selectedMealPlan });
      setGroceryList(res.data.groceryList);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate grocery list.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!groceryList) return;
    setSaving(true);
    try {
      await saveGroceryListApi(groceryList);
      setSaveMessage("Grocery list saved! ✅");
      loadData();
    } catch (err) {
      setSaveMessage(err.response?.data?.message || "Failed to save grocery list.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleItem = async (listId, itemId) => {
    try {
      const res = await toggleGroceryItemApi(listId, itemId);
      setSavedLists((prev) =>
        prev.map((l) => (l._id === listId ? res.data.groceryList : l))
      );
    } catch (err) {
      // Silent fail; not critical
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteGroceryListApi(listId);
      setSavedLists((prev) => prev.filter((l) => l._id !== listId));
    } catch (err) {
      // Silent fail
    }
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">🛒 Grocery List Generator</h1>
          <p className="text-gray-500 mb-6">
            Pick one of your saved meal plans to build a shopping list.
          </p>

          {loadingPlans ? (
            <Loader text="Loading your meal plans..." />
          ) : (
            <div className="card space-y-4">
              {mealPlans.length === 0 ? (
                <p className="text-sm text-gray-500">
                  You don't have any saved meal plans yet. Go to Meal Planner to create one first.
                </p>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select a Meal Plan
                    </label>
                    <select
                      value={selectedMealPlan}
                      onChange={(e) => setSelectedMealPlan(e.target.value)}
                      className="input-field"
                    >
                      <option value="">-- Choose a meal plan --</option>
                      {mealPlans.map((mp) => (
                        <option key={mp._id} value={mp._id}>
                          {mp.title} ({new Date(mp.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}

                  <button onClick={handleGenerate} disabled={generating} className="btn-primary w-full">
                    {generating ? "Generating..." : "✨ Generate Grocery List"}
                  </button>
                </>
              )}
            </div>
          )}

          {generating && <Loader text="Building your shopping list..." />}

          {groceryList && (
            <div className="card mt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">{groceryList.title}</h2>
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
                  {saving ? "Saving..." : "💾 Save List"}
                </button>
              </div>
              {saveMessage && <p className="text-sm mb-3 text-primary-700">{saveMessage}</p>}
              <ul className="divide-y divide-gray-100">
                {groceryList.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between py-2 text-sm">
                    <span>
                      {item.name} {item.quantity && <span className="text-gray-400">({item.quantity})</span>}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">Saved Grocery Lists</h2>
          {savedLists.length === 0 ? (
            <p className="text-sm text-gray-500">No saved grocery lists yet.</p>
          ) : (
            <div className="space-y-4">
              {savedLists.map((list) => (
                <div key={list._id} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{list.title}</h3>
                    <button
                      onClick={() => handleDeleteList(list._id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {list.items.map((item) => (
                      <li key={item._id} className="flex items-center gap-2 py-1.5 text-sm">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleToggleItem(list._id, item._id)}
                          className="w-4 h-4 accent-primary-600"
                        />
                        <span className={item.checked ? "line-through text-gray-400" : ""}>
                          {item.name} {item.quantity && `(${item.quantity})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroceryList;
