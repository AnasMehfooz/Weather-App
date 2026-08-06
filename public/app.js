// Client-side JavaScript for Weather App

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsList = document.getElementById('suggestionsList');
    const cityDatalist = document.getElementById('cityDatalist');
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
    let debounceTimer = null;
    let selectedSuggestionIndex = -1;

    let tasksData = [
        { id: "task-1", title: "Morning Jogging", category: "Fitness", location: "Berlin", outdoor: true, status: "pending" },
        { id: "task-2", title: "Car Washing", category: "Chores", location: "Berlin", outdoor: true, status: "pending" },
        { id: "task-3", title: "Read Java & Web Dev Chapter", category: "Study", location: "Indoor", outdoor: false, status: "completed" }
    ];

    // Rich dataset of cities for instant 1-character popup suggestions
    const cityDatabase = [
        { name: "Berlin", country: "Germany" },
        { name: "Munich", country: "Germany" },
        { name: "Hamburg", country: "Germany" },
        { name: "Frankfurt", country: "Germany" },
        { name: "Cologne", country: "Germany" },
        { name: "Stuttgart", country: "Germany" },
        { name: "Düsseldorf", country: "Germany" },
        { name: "Dresden", country: "Germany" },
        { name: "Leipzig", country: "Germany" },
        { name: "Vienna", country: "Austria" },
        { name: "Zurich", country: "Switzerland" },
        { name: "Geneva", country: "Switzerland" },
        { name: "Paris", country: "France" },
        { name: "Lyon", country: "France" },
        { name: "Marseille", country: "France" },
        { name: "London", country: "United Kingdom" },
        { name: "Manchester", country: "United Kingdom" },
        { name: "Edinburgh", country: "United Kingdom" },
        { name: "Dublin", country: "Ireland" },
        { name: "Madrid", country: "Spain" },
        { name: "Barcelona", country: "Spain" },
        { name: "Rome", country: "Italy" },
        { name: "Milan", country: "Italy" },
        { name: "Amsterdam", country: "Netherlands" },
        { name: "Brussels", country: "Belgium" },
        { name: "Prague", country: "Czech Republic" },
        { name: "Warsaw", country: "Poland" },
        { name: "Budapest", country: "Hungary" },
        { name: "Athens", country: "Greece" },
        { name: "Istanbul", country: "Turkey" },
        { name: "Lisbon", country: "Portugal" },
        { name: "Stockholm", country: "Sweden" },
        { name: "Oslo", country: "Norway" },
        { name: "Copenhagen", country: "Denmark" },
        { name: "Helsinki", country: "Finland" },
        { name: "New York", country: "United States" },
        { name: "Los Angeles", country: "United States" },
        { name: "Chicago", country: "United States" },
        { name: "Miami", country: "United States" },
        { name: "San Francisco", country: "United States" },
        { name: "Toronto", country: "Canada" },
        { name: "Vancouver", country: "Canada" },
        { name: "Montreal", country: "Canada" },
        { name: "Tokyo", country: "Japan" },
        { name: "Osaka", country: "Japan" },
        { name: "Seoul", country: "South Korea" },
        { name: "Beijing", country: "China" },
        { name: "Shanghai", country: "China" },
        { name: "Hong Kong", country: "China" },
        { name: "Singapore", country: "Singapore" },
        { name: "Dubai", country: "United Arab Emirates" },
        { name: "Abu Dhabi", country: "United Arab Emirates" },
        { name: "Sydney", country: "Australia" },
        { name: "Melbourne", country: "Australia" }
    ];

    // Populate HTML datalist for native browser popup support
    function initDatalist() {
        if (!cityDatalist) return;
        cityDatalist.innerHTML = cityDatabase.map(c => 
            `<option value="${escapeHtml(c.name)}">${escapeHtml(c.country)}</option>`
        ).join('');
    }
    initDatalist();

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

    // ==========================================
    // Instant City Autocomplete & Popup Logic
    // ==========================================
    function handleCityInput(query) {
        if (!query || query.trim().length === 0) {
            hideSuggestions();
            return;
        }

        const cleanQuery = query.trim().toLowerCase();
        
        // Instant local match (starts with or contains query)
        const matches = cityDatabase.filter(c => 
            c.name.toLowerCase().startsWith(cleanQuery) || c.name.toLowerCase().includes(cleanQuery)
        ).slice(0, 6);

        renderSuggestions(matches);

        // Async fetch for broader online search
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/cities/suggest?query=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const onlineSuggestions = await res.json();
                    if (onlineSuggestions && onlineSuggestions.length > 0) {
                        renderSuggestions(onlineSuggestions);
                    }
                }
            } catch (err) {
                // Silently keep local matches
            }
        }, 150);
    }

    function renderSuggestions(suggestions) {
        selectedSuggestionIndex = -1;
        if (!suggestions || suggestions.length === 0) {
            hideSuggestions();
            return;
        }

        suggestionsList.innerHTML = suggestions.map((item, idx) => `
            <li class="suggestion-item" data-name="${escapeHtml(item.name)}" data-index="${idx}">
                <span>📍 ${escapeHtml(item.name)}</span>
                <span class="suggestion-country">${escapeHtml(item.country || '')}</span>
            </li>
        `).join('');

        suggestionsList.classList.remove('hidden');

        const items = suggestionsList.querySelectorAll('.suggestion-item');
        items.forEach(item => {
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                selectCity(item.dataset.name);
            });
        });
    }

    function hideSuggestions() {
        suggestionsList.classList.add('hidden');
        suggestionsList.innerHTML = "";
        selectedSuggestionIndex = -1;
    }

    function selectCity(cityName) {
        cityInput.value = cityName;
        hideSuggestions();
        fetchWeather(cityName);
    }

    // Weather API handler
    async function fetchWeather(city) {
        weatherContent.innerHTML = `<div class="loading-spinner">Loading weather for ${city}...</div>`;
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            renderWeather(data);
        } catch (err) {
            console.warn("Using fallback weather:", err);
            renderWeather(getClientFallbackWeather(city));
        }
    }

    function renderWeather(data) {
        currentCity = data.city;
        cityInput.value = `${data.city}${data.country ? ', ' + data.country : ''}`;

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

        const score = data.suitability.score;
        scoreValue.textContent = `${score}%`;
        scoreBar.style.width = `${score}%`;
        recommendationText.textContent = `${data.suitability.recommendation}`;

        hourlyList.innerHTML = data.forecast.map(item => `
            <div class="hourly-item">
                <div class="hourly-time">${item.time}</div>
                <div class="hourly-icon">${item.icon}</div>
                <div class="hourly-temp">${Math.round(item.temperature)}°C</div>
            </div>
        `).join('');
    }

    // Task Management
    async function fetchTasks() {
        try {
            const res = await fetch('/api/tasks');
            if (!res.ok) throw new Error("Server offline");
            tasksData = await res.json();
            renderTasks();
        } catch (err) {
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

    // Input listeners for instant typing suggestions
    cityInput.addEventListener('focus', () => {
        handleCityInput(cityInput.value);
    });

    cityInput.addEventListener('input', (e) => {
        handleCityInput(e.target.value);
    });

    cityInput.addEventListener('keydown', (e) => {
        const items = suggestionsList.querySelectorAll('.suggestion-item');
        if (items.length === 0 || suggestionsList.classList.contains('hidden')) {
            if (e.key === 'Enter') {
                const val = cityInput.value.trim();
                if (val) selectCity(val);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSuggestionIndex = (selectedSuggestionIndex + 1) % items.length;
            highlightSuggestion(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSuggestionIndex = (selectedSuggestionIndex - 1 + items.length) % items.length;
            highlightSuggestion(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
                selectCity(items[selectedSuggestionIndex].dataset.name);
            } else {
                selectCity(cityInput.value.trim());
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });

    function highlightSuggestion(items) {
        items.forEach((item, idx) => {
            if (idx === selectedSuggestionIndex) {
                item.classList.add('active');
                cityInput.value = item.dataset.name;
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Hide popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!cityInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            hideSuggestions();
        }
    });

    searchBtn.addEventListener('click', () => {
        const val = cityInput.value.trim();
        if (val) selectCity(val);
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
