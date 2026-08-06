// Client-side JavaScript for Weather App

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherContent = document.getElementById('weatherContent');
    const scoreValue = document.getElementById('scoreValue');
    const scoreBar = document.getElementById('scoreBar');
    const recommendationText = document.getElementById('recommendationText');
    const hourlyList = document.getElementById('hourlyList');

    const addTaskForm = document.getElementById('addTaskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskCategory = document.getElementById('taskCategory');
    const taskOutdoor = document.getElementById('taskOutdoor');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let currentCity = "Berlin";
    let activeFilter = "all";
    let tasksData = [
        { id: "task-1", title: "Morning Jogging", category: "Fitness", location: "Berlin", outdoor: true, status: "pending" },
        { id: "task-2", title: "Car Washing", category: "Chores", location: "Berlin", outdoor: true, status: "pending" },
        { id: "task-3", title: "Read Java & Web Dev Chapter", category: "Study", location: "Indoor", outdoor: false, status: "completed" }
    ];

    // Client-side fallback weather data
    function getClientFallbackWeather(city) {
        const cityName = city ? (city.charAt(0).toUpperCase() + city.slice(1)) : "Berlin";
        return {
            city: cityName,
            country: "Germany",
            weather: {
                temperature: 21.5,
                windspeed: 12.0,
                description: "Mainly Clear",
                icon: "🌤️",
                precipitationProbability: 10
            },
            suitability: {
                score: 85,
                recommendation: "Great conditions for outdoor activities!"
            },
            forecast: [
                { time: "13:00", temperature: 21.5, description: "Mainly Clear", icon: "🌤️" },
                { time: "14:00", temperature: 22.0, description: "Clear Sky", icon: "☀️" },
                { time: "15:00", temperature: 22.5, description: "Clear Sky", icon: "☀️" },
                { time: "16:00", temperature: 21.8, description: "Partly Cloudy", icon: "⛅" },
                { time: "17:00", temperature: 20.4, description: "Partly Cloudy", icon: "⛅" }
            ]
        };
    }

    // Weather API fetch handler
    async function fetchWeather(city) {
        weatherContent.innerHTML = `<div class="loading-spinner">Loading weather for ${city}...</div>`;
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            renderWeather(data);
        } catch (err) {
            console.warn("Using client fallback weather data:", err);
            // Render fallback weather data seamlessly
            renderWeather(getClientFallbackWeather(city));
        }
    }

    function renderWeather(data) {
        currentCity = data.city;
        cityInput.value = `${data.city}${data.country ? ', ' + data.country : ''}`;

        // Current weather header
        weatherContent.innerHTML = `
            <div class="weather-hero">
                <div class="weather-temp-box">
                    <span class="weather-icon">${data.weather.icon}</span>
                    <div>
                        <div class="temp-num">${Math.round(data.weather.temperature)}°C</div>
                        <div class="city-title">${data.city}${data.country ? ', ' + data.country : ''}</div>
                        <div class="weather-desc">${data.weather.description}</div>
                    </div>
                </div>
                <div class="weather-metrics">
                    <div class="metric-item">Wind: <strong>${data.weather.windspeed} km/h</strong></div>
                    <div class="metric-item">Rain: <strong>${data.weather.precipitationProbability}%</strong></div>
                </div>
            </div>
        `;

        // Suitability score
        const score = data.suitability.score;
        scoreValue.textContent = `${score}%`;
        scoreBar.style.width = `${score}%`;
        recommendationText.textContent = `${data.suitability.recommendation}`;

        // 5-hour forecast
        hourlyList.innerHTML = data.forecast.map(item => `
            <div class="hourly-item">
                <div class="hourly-time">${item.time}</div>
                <div class="hourly-icon">${item.icon}</div>
                <div class="hourly-temp">${Math.round(item.temperature)}°C</div>
            </div>
        `).join('');
    }

    // Task management functions
    async function fetchTasks() {
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) throw new Error("Server offline");
            tasksData = await res.json();
            renderTasks();
        } catch (err) {
            console.warn("Using local tasks memory:", err);
            renderTasks();
        }
    }

    function renderTasks() {
        taskList.innerHTML = "";

        const filtered = tasksData.filter(task => {
            if (activeFilter === "outdoor") return task.outdoor === true;
            if (activeFilter === "indoor") return task.outdoor === false;
            return true;
        });

        if (filtered.length === 0) {
            taskList.innerHTML = `<li style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No tasks in this view.</li>`;
            return;
        }

        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-main">
                    <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''}>
                    <span class="task-title-text">${escapeHtml(task.title)}</span>
                </div>
                <div class="task-meta">
                    <span class="tag-badge ${task.outdoor ? 'tag-outdoor' : 'tag-indoor'}">
                        ${task.outdoor ? 'Outdoor' : 'Indoor'}
                    </span>
                    <button class="btn-delete" title="Delete Task">🗑️</button>
                </div>
            `;

            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', async () => {
                const newStatus = checkbox.checked ? 'completed' : 'pending';
                await updateTaskStatus(task.id, newStatus);
            });

            const deleteBtn = li.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', async () => {
                await deleteTask(task.id);
            });

            taskList.appendChild(li);
        });
    }

    async function addTask(title, category, outdoor) {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category, location: currentCity, outdoor })
            });

            if (res.ok) {
                const newTask = await res.json();
                tasksData.push(newTask);
            } else {
                tasksData.push({ id: `task-${Date.now()}`, title, category, location: currentCity, outdoor, status: "pending" });
            }
        } catch (err) {
            tasksData.push({ id: `task-${Date.now()}`, title, category, location: currentCity, outdoor, status: "pending" });
        }
        renderTasks();
        taskTitle.value = "";
    }

    async function updateTaskStatus(id, status) {
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const updated = await res.json();
                const idx = tasksData.findIndex(t => t.id === id);
                if (idx !== -1) tasksData[idx] = updated;
            } else {
                const idx = tasksData.findIndex(t => t.id === id);
                if (idx !== -1) tasksData[idx].status = status;
            }
        } catch (err) {
            const idx = tasksData.findIndex(t => t.id === id);
            if (idx !== -1) tasksData[idx].status = status;
        }
        renderTasks();
    }

    async function deleteTask(id) {
        try {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.warn("Local task delete:", err);
        }
        tasksData = tasksData.filter(t => t.id !== id);
        renderTasks();
    }

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Event Listeners
    searchBtn.addEventListener('click', () => {
        const val = cityInput.value.trim();
        if (val) fetchWeather(val);
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = cityInput.value.trim();
            if (val) fetchWeather(val);
        }
    });

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskTitle.value.trim();
        const category = taskCategory.value;
        const outdoor = taskOutdoor.checked;
        if (title) {
            addTask(title, category, outdoor);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    fetchWeather("Berlin");
    fetchTasks();
});
