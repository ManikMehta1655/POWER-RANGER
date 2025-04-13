// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const dashboardBtn = document.getElementById('dashboardBtn');
    const logBtn = document.getElementById('logBtn');
    const sections = document.querySelectorAll('main section');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
    }

    // Navigation event listeners
    dashboardBtn.addEventListener('click', () => {
        showSection('dashboard');
        updateDashboard();
    });

    logBtn.addEventListener('click', () => showSection('logData'));
    
    // Weekly summary button
    const summaryBtn = document.getElementById('summaryBtn');
    if (summaryBtn) {
        summaryBtn.addEventListener('click', () => {
            showSection('weeklySummary');
            updateWeeklySummary();
        });
    }

    // Initialize dashboard on page load
    showSection('dashboard');
    // Set default date to today in log form
    document.getElementById('logDate').valueAsDate = new Date();
    updateDashboard();

    // Set generic welcome message
    document.getElementById('welcomeMessage').textContent = 'Welcome to FitFlow!';

    // Data form submission
    const dataForm = document.getElementById('dataForm');
    dataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const water = parseInt(document.getElementById('water').value);
        const exercise = document.getElementById('exercise').value;
        const isRoutine = document.getElementById('isRoutine').checked;
        const exerciseDuration = parseInt(document.getElementById('exerciseDuration').value);
        const calories = parseInt(document.getElementById('calories').value);
        const caloriesBurned = parseInt(document.getElementById('caloriesBurned').value);
        const date = document.getElementById('logDate').value || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        // Get existing data or initialize empty array
        let fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];
        
        // Check if entry exists for today for this user
        const todayIndex = fitnessData.findIndex(entry => entry.date === date);
        
        if (todayIndex >= 0) {
            // Update existing entry
            fitnessData[todayIndex] = { 
                date,
                water, 
                exercise, 
                isRoutine,
                exerciseDuration,
                calories,
                caloriesBurned 
            };
        } else {
        // Add new entry
        fitnessData.push({ 
            date,
            water, 
            exercise, 
            isRoutine,
            exerciseDuration,
            calories,
            caloriesBurned 
        });
        }

        // Save to localStorage
        localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
        
        // Reset form
        dataForm.reset();
        
        // Update charts and dashboard
        updateCharts();
        updateDashboard();
        
        // Show dashboard
        showSection('dashboard');
        
        alert('Data saved successfully!');
    });

    // Initialize charts when page loads
    updateCharts();
});

function updateDashboard() {
    // Set welcome message and member since date
    document.getElementById('welcomeMessage').textContent = 'Welcome to FitFlow!';
    document.getElementById('memberSince').textContent = new Date().toLocaleDateString();

    const fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];
    const today = new Date().toISOString().split('T')[0];
    const todayData = fitnessData.find(entry => entry.date === today);
    const userData = fitnessData;

    // Update stats
    document.getElementById('totalLogs').textContent = userData.length;

    if (todayData) {
        document.getElementById('waterIntake').textContent = `${todayData.water || 0} ml`;
        document.getElementById('caloriesConsumed').textContent = `${todayData.calories || 0} kcal`;
        document.getElementById('exercisesLogged').textContent = todayData.exercise ? '1 activity' : '0 activities';
        document.getElementById('exerciseDuration').textContent = `${todayData.exerciseDuration || 0} minutes`;
        
        // Calculate net calories
        const netCalories = (todayData.calories || 0) - (todayData.caloriesBurned || 0);
        document.getElementById('caloriesNet').textContent = `Net: ${netCalories} kcal`;
        
        // Update water progress circle
        const waterProgress = document.getElementById('waterProgress');
        const waterPercentage = Math.min((todayData.water || 0) / 2000 * 100, 100);
        waterProgress.style.background = `conic-gradient(#4a6fa5 ${waterPercentage}%, #e0e6ed ${waterPercentage}%)`;
        waterProgress.textContent = `${Math.round(waterPercentage)}%`;
    } else {
        document.getElementById('waterIntake').textContent = '0 ml';
        document.getElementById('caloriesConsumed').textContent = '0 kcal';
        document.getElementById('exercisesLogged').textContent = '0 activities';
        document.getElementById('exerciseDuration').textContent = '0 minutes';
        document.getElementById('caloriesNet').textContent = 'Net: 0 kcal';
        document.getElementById('waterProgress').style.background = 'conic-gradient(#4a6fa5 0%, #e0e6ed 0%)';
        document.getElementById('waterProgress').textContent = '0%';
    }

    // Initialize/update charts
    updateCharts(userData);
}

function updateCharts() {
    try {
        // Verify required elements and functions exist
        if (!document.getElementById('waterChart') || 
            !document.getElementById('caloriesChart') || 
            !document.getElementById('exerciseChart')) {
            console.warn('Chart containers not found - retrying in 500ms');
            setTimeout(updateCharts, 500);
            return;
        }

        if (!window.updateWaterChart || !window.updateCaloriesChart || !window.updateExerciseChart) {
            console.error('Chart update functions not loaded');
            return;
        }

        const fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];
        const currentUser = window.checkSession ? window.checkSession() : { username: 'default' };
        if (!currentUser) return;

        const userData = fitnessData.filter(entry => entry.userId === (currentUser.username || 'default'));
        const last7Days = getLastNDays(7);
        
        // Prepare data for charts with validation
        const waterData = last7Days.map(day => {
            const entry = userData.find(d => d.date === day);
            return entry && !isNaN(entry.water) ? parseInt(entry.water) : 0;
        });
        
        const caloriesData = last7Days.map(day => {
            const entry = userData.find(d => d.date === day);
            return entry && !isNaN(entry.calories) ? parseInt(entry.calories) : 0;
        });
        
        const burnedData = last7Days.map(day => {
            const entry = userData.find(d => d.date === day);
            return entry && !isNaN(entry.caloriesBurned) ? parseInt(entry.caloriesBurned) : 0;
        });
        
        const exerciseData = {};
        userData.forEach(entry => {
            if (last7Days.includes(entry.date) && entry.exercise) {
                const exerciseType = entry.exercise.toString();
                const routineStatus = entry.isRoutine ? 'Routine' : 'Non-Routine';
                const key = `${exerciseType} (${routineStatus})`;
                exerciseData[key] = (exerciseData[key] || 0) + 1;
            }
        });

        // Update charts with additional error handling
        try {
            // Add loading state
            document.querySelectorAll('.chart-card').forEach(card => {
                card.classList.remove('loaded');
            });

            // Animate charts sequentially
            setTimeout(() => {
                updateWaterChart(last7Days, waterData);
                document.querySelector('#waterChart').parentElement.classList.add('loaded');
            }, 200);

            setTimeout(() => {
                updateCaloriesChart(caloriesData, burnedData);
                document.querySelector('#caloriesChart').parentElement.classList.add('loaded');
            }, 400);

            setTimeout(() => {
                updateExerciseChart(exerciseData);
                document.querySelector('#exerciseChart').parentElement.classList.add('loaded');
            }, 600);

            // Add tooltip functionality
            const tooltip = document.createElement('div');
            tooltip.className = 'chart-tooltip';
            document.body.appendChild(tooltip);

            document.querySelectorAll('.chart-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    tooltip.style.left = `${e.pageX + 10}px`;
                    tooltip.style.top = `${e.pageY - 10}px`;
                });
            });
        } catch (chartError) {
            console.error('Chart update failed:', chartError);
            // Attempt to destroy and recreate charts if they exist
            if (window.waterChart) window.waterChart.destroy();
            if (window.caloriesChart) window.caloriesChart.destroy();
            if (window.exerciseChart) window.exerciseChart.destroy();
            setTimeout(updateCharts, 1000);
        }

    } catch (error) {
        console.error('Critical error updating charts:', error);
    }
}


function updateWeeklySummary() {
    const fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];
    const last7Days = getLastNDays(7);
    const weeklyData = fitnessData.filter(entry => last7Days.includes(entry.date));
    
    if (weeklyData.length === 0) {
        document.getElementById('summaryStats').innerHTML = '<p>No data available for this week</p>';
        return;
    }
    
    // Calculate summary stats
    const totalWater = weeklyData.reduce((sum, entry) => sum + (entry.water || 0), 0);
    const avgWater = Math.round(totalWater / weeklyData.length);
    const totalCalories = weeklyData.reduce((sum, entry) => sum + (entry.calories || 0), 0);
    const totalCaloriesBurned = weeklyData.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0);
    const netCalories = totalCalories - totalCaloriesBurned;
    const exerciseCount = weeklyData.filter(entry => entry.exercise).length;
    const totalExerciseMinutes = weeklyData.reduce((sum, entry) => sum + (entry.exerciseDuration || 0), 0);
    
    // Calculate goal progress
    const waterGoal = 2000 * 7; // 2L per day
    const waterProgress = Math.min(100, Math.round((totalWater / waterGoal) * 100));
    const exerciseGoal = 150; // 150 minutes per week
    const exerciseProgress = Math.min(100, Math.round((totalExerciseMinutes / exerciseGoal) * 100));
    
    // Get motivational message
    const getMotivation = (progress) => {
        if (progress >= 100) return "🔥 Amazing job! You crushed all your goals!";
        if (progress >= 80) return "👍 Great work! Almost there!";
        if (progress >= 50) return "💪 Good progress! Keep going!";
        return "👋 You got this! Every step counts!";
    };
    
    // Update summary stats display
    const summaryContainer = document.getElementById('summaryStats');
    summaryContainer.innerHTML = `
        <div class="stat-card">
            <h3>Water Intake</h3>
            <p>${avgWater} ml/day</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${waterProgress}%"></div>
            </div>
            <p>${waterProgress}% of weekly goal</p>
        </div>
        <div class="stat-card">
            <h3>Calories</h3>
            <p>Net: ${netCalories} kcal</p>
            <p>Consumed: ${totalCalories}</p>
            <p>Burned: ${totalCaloriesBurned}</p>
        </div>
        <div class="stat-card">
            <h3>Exercise</h3>
            <p>${exerciseCount} sessions</p>
            <p>${totalExerciseMinutes} minutes</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${exerciseProgress}%"></div>
            </div>
            <p>${exerciseProgress}% of weekly goal</p>
        </div>
        <div class="motivation">
            <p>${getMotivation(Math.min(waterProgress, exerciseProgress))}</p>
        </div>
    `;
    
    // Update weekly chart
    if (window.updateWeeklyChart) {
        const weeklyWater = last7Days.map(day => {
            const entry = fitnessData.find(d => d.date === day);
            return entry ? entry.water : 0;
        });
        updateWeeklyChart(last7Days, weeklyWater);
    }
}

function updateLogTable() {
    const fitnessData = JSON.parse(localStorage.getItem('fitnessData')) || [];
    const userData = fitnessData;
    
    // Sort by date (newest first)
    userData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const tableBody = document.querySelector('#logTable tbody');
    tableBody.innerHTML = ''; // Clear existing entries

    userData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.water}</td>
            <td>${entry.exercise}</td>
            <td>${entry.exerciseDuration}</td>
            <td>${entry.calories}</td>
            <td>${entry.caloriesBurned}</td>
        `;
        tableBody.appendChild(row);
    });
}

function getLastNDays(n) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

// AI Ask functionality
document.addEventListener('DOMContentLoaded', function() {
    const aiAskBtn = document.getElementById('aiAskBtn');
    if (aiAskBtn) {
        aiAskBtn.addEventListener('click', () => {
            document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
            document.getElementById('aiAsk').classList.add('active');
        });
    }

    const aiForm = document.getElementById('aiForm');
    if (aiForm) {
        aiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.getElementById('healthQuery').value.trim();
            const resultsDiv = document.getElementById('aiResults');
            
            if (!query) {
                resultsDiv.innerHTML = '<p class="error">Please enter a health question</p>';
                return;
            }
            
            resultsDiv.innerHTML = '<div class="loading">Searching reliable health sources...</div>';
            
            // Mock implementation - would be replaced with real API call
            setTimeout(() => {
                try {
                    const mockResponses = {
                        "headache": [
                            "Common causes include tension, dehydration, or lack of sleep",
                            "Try drinking water and resting in a quiet room",
                            "Consult a doctor if severe or persistent"
                        ],
                        "back pain": [
                            "Often caused by poor posture or muscle strain",
                            "Gentle stretching may help relieve symptoms",
                            "See a doctor if pain radiates down legs or persists"
                        ],
                        "cough": [
                            "Could be due to cold, allergies, or irritation",
                            "Stay hydrated and consider honey for relief",
                            "Seek medical attention if lasts more than 2 weeks"
                        ],
                        "fever": [
                            "Normal body temperature is around 37°C (98.6°F)",
                            "Rest and drink plenty of fluids",
                            "Contact a doctor if fever is above 39°C (102°F) or lasts more than 3 days"
                        ],
                        "fatigue": [
                            "Common causes include stress, poor sleep, or nutritional deficiencies",
                            "Ensure adequate sleep and balanced diet",
                            "Consult a doctor if persistent or accompanied by other symptoms"
                        ]
                    };
                    
                    const normalizedQuery = query.toLowerCase();
                    let response;
                    
                    if (mockResponses[normalizedQuery]) {
                        response = {
                            query: query,
                            results: mockResponses[normalizedQuery],
                            source: "Mock Health Database"
                        };
                    } else {
                        response = {
                            query: query,
                            results: [
                                "General health advice:",
                                "1. Stay hydrated",
                                "2. Get adequate sleep (7-9 hours)",
                                "3. Maintain a balanced diet",
                                "4. Exercise regularly",
                                "5. Consult a healthcare professional for specific concerns"
                            ],
                            source: "General Health Guidelines"
                        };
                    }
                    
                    resultsDiv.innerHTML = `
                        <div class="ai-result">
                            <h4>Information about: ${response.query}</h4>
                            <ul>
                                ${response.results.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                            <div class="result-footer">
                                <p>Source: ${response.source}</p>
                                <p class="disclaimer">Note: This is for informational purposes only and not medical advice. Always consult a healthcare professional.</p>
                            </div>
                        </div>
                    `;
                } catch (error) {
                    resultsDiv.innerHTML = `
                        <div class="error">
                            <p>Error fetching health information</p>
                            <p>Please try again later or consult a healthcare provider</p>
                        </div>
                    `;
                    console.error('AI Ask error:', error);
                }
            }, 1500); // Simulate API delay
        });
    }
});
