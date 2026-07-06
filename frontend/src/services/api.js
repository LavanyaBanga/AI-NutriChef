import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally by logging the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Avoid forcing redirect if already on login/signup page
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ---------- Auth ----------
export const signupApi = (data) => api.post("/auth/signup", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const getMeApi = () => api.get("/auth/me");

// ---------- Recipes ----------
export const generateRecipeApi = (data) => api.post("/recipes/generate", data);
export const saveRecipeApi = (data) => api.post("/recipes", data);
export const getRecipesApi = (params) => api.get("/recipes", { params });
export const deleteRecipeApi = (id) => api.delete(`/recipes/${id}`);

// ---------- Meal Plans ----------
export const generateMealPlanApi = (data) => api.post("/mealplans/generate", data);
export const saveMealPlanApi = (data) => api.post("/mealplans", data);
export const getMealPlansApi = () => api.get("/mealplans");
export const deleteMealPlanApi = (id) => api.delete(`/mealplans/${id}`);

// ---------- Grocery Lists ----------
export const generateGroceryListApi = (data) => api.post("/grocery/generate", data);
export const saveGroceryListApi = (data) => api.post("/grocery", data);
export const getGroceryListsApi = () => api.get("/grocery");
export const toggleGroceryItemApi = (listId, itemId) =>
  api.patch(`/grocery/${listId}/items/${itemId}`);
export const deleteGroceryListApi = (id) => api.delete(`/grocery/${id}`);

// ---------- Chat ----------
export const sendChatMessageApi = (message) => api.post("/chat", { message });
export const getChatHistoryApi = () => api.get("/chat");
export const clearChatHistoryApi = () => api.delete("/chat");

export default api;
