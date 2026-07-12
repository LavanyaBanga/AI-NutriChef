# 🥗 AI NutriChef

**AI NutriChef** is an AI-powered full-stack recipe generation platform that helps users discover personalized recipes based on their available ingredients, dietary preferences, cuisine choices, health goals, and nutritional requirements.

The platform combines artificial intelligence with the MERN stack to provide a smarter and more personalized cooking experience.

🌐 **Live Application:** https://ai-nutrichef-1.onrender.com

---

## 📌 Overview

People often struggle to decide what to cook with the ingredients already available at home. Finding recipes that also match dietary restrictions, fitness goals, allergies, and cuisine preferences can be time-consuming.

AI NutriChef solves this problem by allowing users to enter their ingredients and preferences. The platform then generates personalized recipes with cooking instructions, estimated preparation time, nutritional information, and ingredient recommendations.

---

## ✨ Features

### 🤖 AI-Powered Recipe Generation

* Generate recipes using artificial intelligence.
* Enter available ingredients to receive personalized suggestions.
* Get detailed cooking instructions.
* Receive recipe names, ingredient quantities, and preparation steps.
* Generate creative meals from limited ingredients.

### 🥦 Ingredient-Based Recommendations

* Add ingredients currently available at home.
* Reduce food waste by using existing ingredients.
* Receive suggestions for missing or optional ingredients.
* Generate multiple recipe ideas from similar ingredients.

### 🍽️ Dietary Preferences

Users can personalize recipes according to preferences such as:

* Vegetarian
* Vegan
* High-protein
* Low-carb
* Gluten-free
* Dairy-free
* Weight-loss friendly
* Balanced diet

### 🌍 Cuisine Selection

Generate recipes inspired by different cuisines, including:

* Indian
* Italian
* Mexican
* Chinese
* Mediterranean
* Continental
* Asian
* Fusion

### 📊 Nutritional Information

Recipes may include estimated nutritional values such as:

* Calories
* Protein
* Carbohydrates
* Fats
* Fibre
* Serving size

### ❤️ Save Favourite Recipes

* Save generated recipes for later.
* View previously saved recipes.
* Remove recipes from favourites.
* Build a personal recipe collection.

### 🔐 User Authentication

* User registration and login.
* JWT-based authentication.
* Secure password hashing.
* Protected user routes.
* Personalised recipe history.

### 📱 Responsive Design

* Mobile-friendly interface.
* Responsive layout for desktop, tablet, and mobile.
* Simple and modern dashboard.
* Smooth navigation between pages.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Framer Motion

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt.js

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Artificial Intelligence

* AI API integration for recipe generation
* Prompt-based recipe personalisation
* Structured AI-generated responses

### Deployment

* Render

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Postman
* MongoDB Atlas

---

## 🏗️ System Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ Axios HTTP Requests
  ▼
Node.js and Express.js Backend
  │
  ├── Authentication Controller
  ├── Recipe Controller
  ├── AI Recipe Service
  ├── Favourite Recipe Management
  └── User Profile Management
  │
  ├──────────────► AI Recipe Generation API
  │
  ▼
MongoDB Database
```

---

## 📂 Project Structure

```text
AI-NutriChef/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd AI-NutriChef
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
AI_API_KEY=your_ai_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

---

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable         | Description                              |
| ---------------- | ---------------------------------------- |
| `PORT`           | Port used by the backend server          |
| `MONGO_URI`      | MongoDB Atlas database connection string |
| `JWT_SECRET`     | Secret key used for JWT authentication   |
| `JWT_EXPIRES_IN` | JWT expiration duration                  |
| `AI_API_KEY`     | API key used for AI recipe generation    |
| `CLIENT_URL`     | Allowed frontend URL                     |
| `VITE_API_URL`   | Backend API base URL                     |
| `NODE_ENV`       | Application environment                  |

> Never upload `.env` files, passwords, database credentials, or API keys to GitHub.

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Recipe Generation

```http
POST /api/recipes/generate
GET  /api/recipes/history
GET  /api/recipes/:id
DELETE /api/recipes/:id
```

### Favourite Recipes

```http
GET    /api/favourites
POST   /api/favourites
DELETE /api/favourites/:id
```

### User Profile

```http
GET /api/users/profile
PUT /api/users/profile
```

> API endpoint names may vary depending on the final route configuration.

---

## 🧠 AI Recipe Generation Flow

1. The user enters available ingredients.
2. The user selects dietary preferences, cuisine, and health goals.
3. The frontend sends the information to the backend.
4. The backend creates a structured AI prompt.
5. The AI service generates a personalised recipe.
6. The backend validates and processes the response.
7. The generated recipe is displayed on the frontend.
8. The user can save the recipe to their account.

---

## 🔐 Authentication Flow

1. The user registers or logs in.
2. The backend validates the credentials.
3. The password is verified securely.
4. A JSON Web Token is generated.
5. The token is stored on the client side.
6. The token is included in protected API requests.
7. Authentication middleware verifies the token.
8. The user receives access to protected features.

---

## 🚀 Deployment

AI NutriChef is deployed using **Render**.

### Frontend Deployment

Use the following configuration:

```text
Build Command: npm install && npm run build
Publish Directory: dist
```

Add the production backend URL:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Backend Deployment

Use the following configuration:

```text
Build Command: npm install
Start Command: npm start
```

Configure all backend environment variables in the Render dashboard.

Example:

```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_production_secret
AI_API_KEY=your_ai_api_key
CLIENT_URL=https://your-frontend-url.onrender.com
```

---

## 🛡️ Security Features

* Password hashing using bcrypt.
* JWT-based authentication.
* Protected backend routes.
* Environment variable protection.
* CORS configuration.
* Input validation.
* Centralised error handling.
* Authorisation checks for personal recipes and favourites.

---

## 📈 Future Enhancements

* Image-based ingredient recognition.
* Voice-based ingredient input.
* AI meal planning for an entire week.
* Personalised diet plans.
* Grocery list generation.
* Recipe image generation.
* Barcode scanning for packaged ingredients.
* Allergy detection and warnings.
* Calorie and macro tracking.
* Shopping list export.
* Recipe rating and review system.
* Social recipe sharing.
* Multilingual recipe generation.
* Cooking timer integration.
* AI chatbot for cooking assistance.
* Recommendations based on previous recipes.

---

## 💡 Key Learnings

Building AI NutriChef provided practical experience in:

* Developing a complete MERN stack application.
* Integrating artificial intelligence into a web application.
* Creating structured prompts for AI-generated responses.
* Building and consuming REST APIs.
* Implementing JWT-based authentication.
* Managing MongoDB data using Mongoose.
* Creating reusable React components.
* Managing frontend state and API requests.
* Handling CORS and deployment configurations.
* Debugging authentication and API integration issues.
* Deploying a full-stack application on Render.
* Designing responsive and user-friendly interfaces.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature-name
```

5. Open a pull request.

---

## 👩‍💻 Author

**Lavanya Banga**

B.Tech Computer Science Engineering Student
MERN Stack Developer

---

## 📄 License

This project is created for educational, learning, and portfolio purposes.

---

## ⭐ Support

If you found AI NutriChef useful or interesting, consider giving the repository a star.

Feedback, suggestions, and contributions are always appreciated.
