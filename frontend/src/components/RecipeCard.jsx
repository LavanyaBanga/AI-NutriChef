import React from "react";

const RecipeCard = ({ recipe, onSave, onDelete, saving }) => {
  if (!recipe) return null;

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xl font-bold text-primary-800">{recipe.name}</h3>
        {recipe.prepTime && (
          <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full whitespace-nowrap">
            ⏱ {recipe.prepTime}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-lg font-semibold">{recipe.calories ?? "-"}</p>
          <p className="text-xs text-gray-500">Calories</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-lg font-semibold">{recipe.protein ?? "-"}g</p>
          <p className="text-xs text-gray-500">Protein</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-lg font-semibold">{recipe.carbs ?? "-"}g</p>
          <p className="text-xs text-gray-500">Carbs</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-lg font-semibold">{recipe.fats ?? "-"}g</p>
          <p className="text-xs text-gray-500">Fats</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-1">Ingredients</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
          {(recipe.ingredients || []).map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-1">Steps</h4>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          {(recipe.steps || []).map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {(onSave || onDelete) && (
        <div className="flex gap-2 pt-2">
          {onSave && (
            <button onClick={onSave} disabled={saving} className="btn-primary text-sm">
              {saving ? "Saving..." : "💾 Save Recipe"}
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="btn-secondary text-sm">
              🗑 Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
