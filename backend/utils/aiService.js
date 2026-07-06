const fetch = require("node-fetch");

const AI_PROVIDER = (process.env.AI_PROVIDER || "gemini").toLowerCase();

/**
 * Extracts the first valid JSON object/array found in a string.
 * AI models sometimes wrap JSON in markdown code fences or add extra text,
 * so this helper strips that and safely parses it.
 */
function extractJSON(rawText) {
  if (!rawText) throw new Error("Empty AI response");

  let text = rawText.trim();

  // Remove markdown code fences like ```json ... ```
  text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // Fall back to extracting the first {...} or [...] block
  }

  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  let start = -1;

  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  const lastBrace = text.lastIndexOf("}");
  const lastBracket = text.lastIndexOf("]");
  const end = Math.max(lastBrace, lastBracket);

  if (start === -1 || end === -1 || end < start) {
    throw new Error("Could not locate JSON in AI response");
  }

  const jsonSlice = text.slice(start, end + 1);
  return JSON.parse(jsonSlice);
}

/**
 * Calls Google Gemini API with a text prompt and returns the raw text response.
 */
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment variables");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API request failed");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini API returned no content");

  return text;
}

/**
 * Calls OpenAI Chat Completions API with a text prompt and returns the raw text response.
 */
async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) throw new Error("OPENAI_API_KEY is not set in environment variables");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI API request failed");
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI API returned no content");

  return text;
}

/**
 * Generic function that routes the prompt to whichever AI provider is configured.
 */
async function generateText(prompt) {
  if (AI_PROVIDER === "openai") {
    return callOpenAI(prompt);
  }
  return callGemini(prompt);
}

/**
 * Generates a single recipe as structured JSON based on user inputs.
 */
async function generateRecipe({ ingredients, dietGoal, allergies, cuisine, mealType }) {
  const prompt = `
You are a professional nutritionist and chef AI. Based on the details below, create ONE recipe.

Available ingredients: ${ingredients.join(", ") || "any common ingredients"}
Diet goal: ${dietGoal || "balanced diet"}
Allergies / foods to avoid: ${allergies.join(", ") || "none"}
Cuisine preference: ${cuisine || "any"}
Meal type: ${mealType || "any"}

Respond with ONLY valid JSON (no markdown, no extra text) in exactly this shape:
{
  "name": "Recipe name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["step 1", "step 2"],
  "calories": 123,
  "protein": 12,
  "carbs": 34,
  "fats": 5,
  "prepTime": "20 minutes"
}
Do not include any allergy-listed ingredients. Keep steps concise and beginner-friendly.
`;

  const rawText = await generateText(prompt);
  return extractJSON(rawText);
}

/**
 * Generates a 7-day meal plan as structured JSON.
 */
async function generateMealPlan({ dietGoal, allergies, cuisine }) {
  const prompt = `
You are a professional nutritionist AI. Create a 7-day weekly meal plan.

Diet goal: ${dietGoal || "balanced diet"}
Allergies / foods to avoid: ${allergies.join(", ") || "none"}
Cuisine preference: ${cuisine || "any"}

Respond with ONLY valid JSON (no markdown, no extra text) in exactly this shape:
{
  "title": "Weekly Meal Plan",
  "days": [
    {
      "day": "Monday",
      "breakfast": "short description",
      "lunch": "short description",
      "dinner": "short description",
      "snacks": "short description"
    }
  ]
}
Include all 7 days (Monday through Sunday). Keep descriptions short (one sentence each).
`;

  const rawText = await generateText(prompt);
  return extractJSON(rawText);
}

/**
 * Generates a grocery list as structured JSON from a meal plan's contents.
 */
async function generateGroceryList({ mealPlanText }) {
  const prompt = `
You are a professional nutrition assistant AI. Based on this weekly meal plan, generate a consolidated grocery shopping list.

Meal plan:
${mealPlanText}

Respond with ONLY valid JSON (no markdown, no extra text) in exactly this shape:
{
  "title": "Grocery List",
  "items": [
    { "name": "item name", "quantity": "e.g. 2 kg", "category": "Produce" }
  ]
}
Group similar items together, avoid duplicates, and use common grocery categories like Produce, Dairy, Meat & Protein, Grains, Spices, Other.
`;

  const rawText = await generateText(prompt);
  return extractJSON(rawText);
}

/**
 * Generates a plain-text chatbot reply for nutrition/recipe questions.
 */
async function generateChatReply({ history, message }) {
  const historyText = (history || [])
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `
You are AI NutriChef's friendly nutrition and cooking assistant. Answer the user's question clearly and helpfully.
Keep answers focused on food, nutrition, recipes, and healthy eating. Keep it conversational, not overly long.

Conversation so far:
${historyText}

User: ${message}

Respond with plain text only (no JSON, no markdown headers).
`;

  const rawText = await generateText(prompt);
  return rawText.trim();
}

module.exports = {
  generateRecipe,
  generateMealPlan,
  generateGroceryList,
  generateChatReply,
};
