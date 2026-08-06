/**
 * WeatherSync Backend Server
 * Course: Project Java and Web Development (DLBCSPJWD01)
 * 
 * Features:
 * 1. Consumes Open-Meteo REST API on the backend to retrieve real-time weather & forecasts.
 * 2. Transforms raw weather data into activity suitability scores for frontend consumption.
 * 3. Provides RESTful CRUD endpoints for task management.
 * 4. Serves frontend static files and provides robust error handling.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initial seed tasks if tasks.json doesn't exist
const initialTasks = [
    {
        id: "task-1",
        title: "Morning Jogging",
        category: "Fitness",
        location: "Berlin",
        outdoor: true,
        status: "pending",
        createdAt: new Date().toISOString()
    },
    {
        id: "task-2",
        title: "Car Washing",
        category: "Chores",
        location: "Berlin",
        outdoor: true,
        status: "pending",
        createdAt: new Date().toISOString()
    },
    {
        id: "task-3",
        title: "Read Java & Web Dev Chapter",
        category: "Study",
        location: "Indoor",
        outdoor: false,
        status: "completed",
        createdAt: new Date().toISOString()
    }
];

// Ensure tasks storage exists
function loadTasks() {
    try {
        if (!fs.existsSync(TASKS_FILE)) {
            fs.writeFileSync(TASKS_FILE, JSON.stringify(initialTasks, null, 2));
            return initialTasks;
        }
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading tasks file:", err);
        return initialTasks;
    }
}

function saveTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        console.error("Error saving tasks file:", err);
    }
}

/**
 * Activity Suitability Algorithm
 * Evaluates weather conditions (temp, precipitation, wind, weathercode) 
 * and calculates a 0-100% suitability rating for outdoor activities.
 */
function calculateSuitability(temp, precipProb, windspeed, weatherCode) {
    let score = 100;

    // Temperature penalty (Ideal range: 15°C - 25°C)
    if (temp < 10) score -= (10 - temp) * 3;
    else if (temp > 28) score -= (temp - 28) * 4;

    // Rain / Precipitation penalty
    score -= precipProb * 0.8;

    // Wind speed penalty (Ideal: < 20 km/h)
    if (windspeed > 20) score -= (windspeed - 20) * 1.5;

    // Weather code severe conditions (Thunderstorm, Snow, Heavy Rain)
    if ([95, 96, 99, 71, 73, 75, 65].includes(weatherCode)) {
        score -= 40;
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
    
    let recommendation = "Ideal for Outdoor Activities";
    if (score < 40) recommendation = "Poor Weather - Move Tasks Indoors";
    else if (score < 75) recommendation = "Moderate Conditions - Exercise Caution";

    return { score, recommendation };
}

// Map WMO Weather Interpretation Codes to human readable descriptions & icons
function getWeatherDescription(code) {
    const map = {
        0: { desc: "Clear Sky", icon: "☀️" },
        1: { desc: "Mainly Clear", icon: "🌤️" },
        2: { desc: "Partly Cloudy", icon: "⛅" },
        3: { desc: "Overcast", icon: "☁️" },
        45: { desc: "Foggy", icon: "🌫️" },
        51: { desc: "Light Drizzle", icon: "🌦️" },
        61: { desc: "Slight Rain", icon: "🌧️" },
        63: { desc: "Moderate Rain", icon: "🌧️" },
        65: { desc: "Heavy Rain", icon: "🌧️" },
        71: { desc: "Slight Snow", icon: "🌨️" },
        95: { desc: "Thunderstorm", icon: "⛈️" }
    };
    return map[code] || { desc: "Cloudy", icon: "☁️" };
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", service: "WeatherSync API", timestamp: new Date() });
});

// Dynamic Aspect 1: Weather API Endpoint (Backend fetches Open-Meteo & transforms payload)
app.get('/api/weather', async (req, res) => {
    try {
        const city = req.query.city || "Berlin";

        // 1. Geocoding request
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ error: `City '${city}' not found.` });
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;

        // 2. Weather forecast request
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weathercode,windspeed_10m&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const current = weatherData.current_weather;
        const currentCode = current.weathercode;
        const weatherInfo = getWeatherDescription(currentCode);

        // Calculate outdoor suitability score
        // Default precip prob to 0 if not available in current
        const precipProb = weatherData.hourly?.precipitation_probability?.[0] || 0;
        const suitability = calculateSuitability(current.temperature, precipProb, current.windspeed, currentCode);

        // Hourly forecast summary (next 5 hours)
        const hourlyForecast = [];
        if (weatherData.hourly && weatherData.hourly.time) {
            for (let i = 0; i < 5; i++) {
                const rawTime = weatherData.hourly.time[i];
                const timeStr = rawTime ? rawTime.split('T')[1] : `${i}:00`;
                const temp = weatherData.hourly.temperature_2m[i];
                const code = weatherData.hourly.weathercode[i];
                const info = getWeatherDescription(code);
                hourlyForecast.push({
                    time: timeStr,
                    temperature: temp,
                    description: info.desc,
                    icon: info.icon
                });
            }
        }

        const responsePayload = {
            city: location.name,
            country: location.country,
            coordinates: { lat, lon },
            weather: {
                temperature: current.temperature,
                windspeed: current.windspeed,
                weathercode: currentCode,
                description: weatherInfo.desc,
                icon: weatherInfo.icon,
                precipitationProbability: precipProb
            },
            suitability: suitability,
            forecast: hourlyForecast
        };

        res.json(responsePayload);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Failed to retrieve transformed weather data from server." });
    }
});

// Dynamic Aspect 2: Task CRUD Endpoints

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
    const tasks = loadTasks();
    res.json(tasks);
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
    const { title, category, location, outdoor } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Task title is required." });
    }

    const tasks = loadTasks();
    const newTask = {
        id: `task-${Date.now()}`,
        title: title.trim(),
        category: category || "General",
        location: location || "Berlin",
        outdoor: Boolean(outdoor),
        status: "pending",
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status, title, category, outdoor } = req.body;
    
    let tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Task not found." });
    }

    if (status !== undefined) tasks[index].status = status;
    if (title !== undefined) tasks[index].title = title;
    if (category !== undefined) tasks[index].category = category;
    if (outdoor !== undefined) tasks[index].outdoor = outdoor;

    saveTasks(tasks);
    res.json(tasks[index]);
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    let tasks = loadTasks();
    const initialLength = tasks.length;

    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ error: "Task not found." });
    }

    saveTasks(tasks);
    res.json({ message: "Task deleted successfully.", id });
});

// Start Server
app.listen(PORT, () => {
    console.log(`WeatherSync Server is running on http://localhost:${PORT}`);
});

module.exports = app;
