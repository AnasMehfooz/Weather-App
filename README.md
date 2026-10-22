# WeatherSync - Weather & Task Planner

A web application built for the **Project Java and Web Development (DLBCSPJWD01)** course by Anas Mehfooz.

WeatherSync helps users organize daily tasks by checking live weather conditions. The backend fetches current weather data from the Open-Meteo REST API, calculates an outdoor activity suitability score, and provides endpoints for managing user tasks.

---

## Tech Stack
* **Frontend**: HTML5, CSS3 (Flexbox/Grid, Responsive), JavaScript (ES6+)
* **Backend**: Node.js, Express.js
* **External API**: Open-Meteo REST API (fetched on server side)
* **Storage**: Local JSON file (`tasks.json`)
* **Testing**: Built-in Node test runner (`node --test`)

---

## Setup & Running Locally

### 1. Prerequisites
Make sure you have Node.js (v18 or higher) installed on your system.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/AnasMehfooz/Weather-App.git
cd Weather-App
npm install
```

### 3. Start the Application
Run the local server:
```bash
npm start
```
Open your browser and navigate to: `http://localhost:3000`

### 4. Running Tests
Run the test suite:
```bash
npm test
```

---

## Main Features
* **Weather & Suitability Lookup**: Search for any city to view current temperature, wind speed, precipitation chance, 5-hour forecast, and calculated outdoor score.
* **Task Management**: Create, complete, filter (All / Outdoor / Indoor), and delete daily tasks.
* **Responsive Layout**: Designed to adapt smoothly across mobile, tablet, and desktop screens.

## License

MIT, see [LICENSE](LICENSE).
