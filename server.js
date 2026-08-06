// Express server for Weather App
// Backend API handling weather data fetching, city suggestions, and task storage

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Popular cities list for offline/fallback suggestions
const popularCities = [
    { name: "Berlin", country: "Germany" },
    { name: "Munich", country: "Germany" },
    { name: "Hamburg", country: "Germany" },
    { name: "Frankfurt", country: "Germany" },
    { name: "Cologne", country: "Germany" },
    { name: "London", country: "United Kingdom" },
    { name: "Paris", country: "France" },
    { name: "New York", country: "United States" },
    { name: "Tokyo", country: "Japan" },
    { name: "Dubai", country: "United Arab Emirates" },
    { name: "Rome", country: "Italy" },
    { name: "Madrid", country: "Spain" },
    { name: "Amsterdam", country: "Netherlands" },
    { name: "Toronto", country: "Canada" },
    { name: "Sydney", country: "Australia" }
];

// Initial tasks
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

function calculateSuitability(temp, precipProb, windspeed, weatherCode) {
    let score = 100;

    if (temp < 10) score -= (10 - temp) * 3;
    else if (temp > 28) score -= (temp - 28) * 4;

    score -= precipProb * 0.8;

    if (windspeed > 20) score -= (windspeed - 20) * 1.5;

    if ([95, 96, 99, 71, 73, 75, 65].includes(weatherCode)) {
        score -= 40;
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
    
    let recommendation = "Great conditions for outdoor activities!";
    if (score < 40) recommendation = "Poor weather - stay indoors today";
    else if (score < 75) recommendation = "Moderate weather - keep an eye on conditions";

    return { score, recommendation };
}

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

function getFallbackWeather(city) {
    const name = city ? (city.charAt(0).toUpperCase() + city.slice(1)) : "Berlin";
    const temp = 21.5;
    const wind = 12.0;
    const weatherCode = 1;
    const info = getWeatherDescription(weatherCode);
    const suitability = calculateSuitability(temp, 10, wind, weatherCode);

    return {
        city: name,
        country: "Germany",
        coordinates: { lat: 52.52, lon: 13.41 },
        weather: {
            temperature: temp,
            windspeed: wind,
            weathercode: weatherCode,
            description: info.desc,
            icon: info.icon,
            precipitationProbability: 10
        },
        suitability: suitability,
        forecast: [
            { time: "13:00", temperature: 21.5, description: info.desc, icon: info.icon },
            { time: "14:00", temperature: 22.0, description: "Clear Sky", icon: "☀️" },
            { time: "15:00", temperature: 22.5, description: "Clear Sky", icon: "☀️" },
            { time: "16:00", temperature: 21.8, description: "Partly Cloudy", icon: "⛅" },
            { time: "17:00", temperature: 20.4, description: "Partly Cloudy", icon: "⛅" }
        ]
    };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});

// City Autocomplete / Suggestions Endpoint
app.get('/api/cities/suggest', async (req, res) => {
    const query = req.query.query || "";
    if (!query || query.trim().length < 2) {
        return res.json([]);
    }

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(3000) });
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
            const suggestions = geoData.results.map(item => ({
                name: item.name,
                country: item.country || "",
                admin1: item.admin1 || ""
            }));
            return res.json(suggestions);
        }
    } catch (err) {
        console.warn("Geocoding suggest API error, using local match:", err.message);
    }

    // Local fallback filter
    const matches = popularCities.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase())
    );
    res.json(matches);
});

// Weather endpoint with fallback
app.get('/api/weather', async (req, res) => {
    const city = req.query.city || "Berlin";

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(4000) });
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.json(getFallbackWeather(city));
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weathercode,windspeed_10m&timezone=auto`;
        const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(4000) });
        const weatherData = await weatherRes.json();

        const current = weatherData.current_weather;
        const currentCode = current.weathercode;
        const weatherInfo = getWeatherDescription(currentCode);
        const precipProb = weatherData.hourly?.precipitation_probability?.[0] || 0;

        const suitability = calculateSuitability(current.temperature, precipProb, current.windspeed, currentCode);

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

        res.json({
            city: location.name,
            country: location.country || "",
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
        });
    } catch (error) {
        console.warn("Weather API fetch failed, using fallback data:", error.message);
        res.json(getFallbackWeather(city));
    }
});

// Task Endpoints
app.get('/api/tasks', (req, res) => {
    const tasks = loadTasks();
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { title, category, location, outdoor } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required." });
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

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    let tasks = loadTasks();
    const initialLength = tasks.length;

    tasks = tasks.filter(t => t.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ error: "Task not found." });
    }

    saveTasks(tasks);
    res.json({ message: "Task deleted.", id });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
