import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-nutrichef.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

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

// Auth
export const signupApi = (data) => api.post("/auth/signup", data);
export const loginApi = (data) => api.post("/auth/login", data);
export const getMeApi = () => api.get("/auth/me");

// Recipes
export const generateRecipeApi = (data) =>
  api.post("/recipes/generate", data);

export const saveRecipeApi = (data) =>
  api.post("/recipes", data);

export const getRecipesApi = (params) =>
  api.get("/recipes", { params });

export const deleteRecipeApi = (id) =>
  api.delete(`/recipes/${id}`);

// Meal Plans
export const generateMealPlanApi = (data) =>
  api.post("/mealplans/generate", data);

export const saveMealPlanApi = (data) =>
  api.post("/mealplans", data);

export const getMealPlansApi = () =>
  api.get("/mealplans");

export const deleteMealPlanApi = (id) =>
  api.delete(`/mealplans/${id}`);

// Grocery
export const generateGroceryListApi = (data) =>
  api.post("/grocery/generate", data);

export const saveGroceryListApi = (data) =>
  api.post("/grocery", data);

export const getGroceryListsApi = () =>
  api.get("/grocery");

export const toggleGroceryItemApi = (listId, itemId) =>
  api.patch(`/grocery/${listId}/items/${itemId}`);

export const deleteGroceryListApi = (id) =>
  api.delete(`/grocery/${id}`);

// Chat
export const sendChatMessageApi = (message) =>
  api.post("/chat", { message });

export const getChatHistoryApi = () =>
  api.get("/chat");

export const clearChatHistoryApi = () =>
  api.delete("/chat");

export default api;