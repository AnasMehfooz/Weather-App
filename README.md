# WeatherSync – Smart Activity & Weather-Integrated Task Planner

**Course**: Project Java and Web Development (DLBCSPJWD01)  
**IU International University of Applied Sciences**

---

## 📌 Project Overview
WeatherSync is a responsive web application designed to connect daily task management with real-time weather forecasts. It fetches live meteorological data from an external REST API (Open-Meteo), transforms raw metrics into an outdoor activity suitability score, and provides a dynamic task management dashboard.

---

## 🛠️ Technology Stack
* **Frontend**: HTML5, CSS3 (Modern Flexbox/Grid, Responsive Design), Vanilla JavaScript (ES6+)
* **Backend**: Node.js, Express.js
* **External API**: Open-Meteo REST API (consumed strictly on the backend)
* **Data Storage**: JSON file storage (`tasks.json`)
* **Testing**: Node.js test runner (`node:test`)

---

## 🚀 Installation & Setup Instructions

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v8.0.0 or higher

### Step 1: Clone or Extract Repository
```bash
git clone https://github.com/AnasMehfooz/Weather-App.git
cd Weather-App
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Application Server
```bash
npm start
```
The server will start at: `http://localhost:3000`

### Step 4: Run Automated Tests
```bash
npm test
```

---

## ⚡ Key Features & Dynamic Interactions

1. **Dynamic Aspect 1 – Weather & Activity Suitability Query**
   - User searches for any city (e.g., Berlin, Munich, London).
   - Frontend sends an asynchronous request to `/api/weather?city={cityName}`.
   - Backend queries Open-Meteo API, calculates a suitability score (0–100%), and returns formatted JSON payload.
   - Frontend dynamically updates weather cards, suitability progress bar, and 5-hour forecast widgets without page refresh.

2. **Dynamic Aspect 2 – Task CRUD Operations**
   - **Create**: Add new indoor or outdoor tasks.
   - **Update/Toggle**: Mark tasks as complete/pending.
   - **Delete**: Remove tasks from persistent storage.
   - **Filter**: Filter tasks by All, Outdoor, or Indoor categories.

---

## 🧪 Test Cases & Automated Test Suite
Run `npm test` to execute the automated test suite covering:
* `Suitability Calculation - Ideal Conditions`
* `Suitability Calculation - Adverse Weather Conditions`
* `Task Data Integrity Validation`
