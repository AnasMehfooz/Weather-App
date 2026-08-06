/**
 * WeatherSync Client App Logic
 * Handlers for Dynamic Interactions:
 * 1. Fetching transformed weather & suitability score from Node.js backend
 * 2. CRUD task operations (Add, Toggle, Delete, Filter) communicating with backend
 */

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
    let tasksData = [];

    // ==========================================
    // DYNAMIC ASPECT 1: Weather & Suitability API
    // ==========================================
    async function fetchWeather(city) {
        weatherContent.innerHTML = `<div class="loading-spinner">Fetching live weather for ${city}...</div>`;
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to load weather.");
            }
            const data = await res.json();
            renderWeather(data);
        } catch (err) {
            weatherContent.innerHTML = `<div style="color: var(--accent-danger); padding: 1rem;">⚠️ ${err.message}</div>`;
            scoreValue.textContent = "--%";
            scoreBar.style.width = "0%";
            recommendationText.textContent = "Unable to calculate suitability score.";
        }
    }

    function renderWeather(data) {
        currentCity = data.city;
        cityInput.value = `${data.city}, ${data.country}`;

        // Render Hero Box
        weatherContent.innerHTML = `
            <div class="weather-hero">
                <div class="weather-temp-box">
                    <span class="weather-icon">${data.weather.icon}</span>
                    <div>
                        <div class="temp-num">${Math.round(data.weather.temperature)}°C</div>
                        <div class="city-title">${data.city}, ${data.country}</div>
                        <div class="weather-desc">${data.weather.description}</div>
                    </div>
                </div>
                <div class="weather-metrics">
                    <div class="metric-item">Wind: <strong>${data.weather.windspeed} km/h</strong></div>
                    <div class="metric-item">Rain Prob: <strong>${data.weather.precipitationProbability}%</strong></div>
                </div>
            </div>
        `;

        // Render Suitability Score
        const score = data.suitability.score;
        scoreValue.textContent = `${score}%`;
        scoreBar.style.width = `${score}%`;
        recommendationText.textContent = `${data.suitability.recommendation}`;

        // Render Hourly Forecast
        hourlyList.innerHTML = data.forecast.map(item => `
            <div class="hourly-item">
                <div class="hourly-time">${item.time}</div>
                <div class="hourly-icon">${item.icon}</div>
                <div class="hourly-temp">${Math.round(item.temperature)}°C</div>
            </div>
        `).join('');
    }

    // ==========================================
    // DYNAMIC ASPECT 2: Task CRUD Operations
    // ==========================================
    async function fetchTasks() {
        try {
            const res = await fetch('/api/tasks');
            tasksData = await res.json();
            renderTasks();
        } catch (err) {
            console.error("Error fetching tasks:", err);
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
            taskList.innerHTML = `<li style="text-align: center; color: var(--text-secondary); padding: 1.5rem;">No tasks found for this view.</li>`;
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
                        ${task.outdoor ? ' Outdoor' : ' Indoor'}
                    </span>
                    <button class="btn-delete" title="Delete Task">🗑️</button>
                </div>
            `;

            // Toggle completion listener
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', async () => {
                const newStatus = checkbox.checked ? 'completed' : 'pending';
                await updateTaskStatus(task.id, newStatus);
            });

            // Delete task listener
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
                renderTasks();
                taskTitle.value = "";
            }
        } catch (err) {
            console.error("Error adding task:", err);
        }
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
                renderTasks();
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    }

    async function deleteTask(id) {
        try {
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                tasksData = tasksData.filter(t => t.id !== id);
                renderTasks();
            }
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    }

    // Helper: Escape HTML to prevent XSS
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

    // Initial Load
    fetchWeather("Berlin");
    fetchTasks();
});
