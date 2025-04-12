// Chart configurations and update functions
let waterChart, caloriesChart, exerciseChart, weeklyChart;

// Initialize or update water intake chart
window.updateWaterChart = function(labels, data) {
    const ctx = document.getElementById('waterChart').getContext('2d');
    
    if (waterChart) {
        waterChart.data.labels = labels;
        waterChart.data.datasets[0].data = data;
        waterChart.update();
        return;
    }

    waterChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Water Intake (ml)',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Milliliters (ml)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
};

// Initialize or update calories chart
window.updateCaloriesChart = function(consumedData, burnedData) {
    const ctx = document.getElementById('caloriesChart').getContext('2d');
    const goal = 2000; // Default calorie goal
    const consumed = consumedData[consumedData.length - 1] || 0;
    const burned = burnedData[burnedData.length - 1] || 0;
    const net = consumed - burned;

    if (caloriesChart) {
        caloriesChart.data.datasets[0].data = [consumed, burned, Math.max(0, goal - consumed)];
        caloriesChart.update();
        return;
    }

    caloriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Consumed', 'Burned', 'Remaining'],
            datasets: [{
                data: [consumed, burned, Math.max(0, goal - consumed)],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 205, 86, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Calories vs Goal'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} kcal`;
                        }
                    }
                }
            }
        }
    });
};

// Initialize or update exercise chart
window.updateExerciseChart = function(data) {
    const ctx = document.getElementById('exerciseChart').getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    if (exerciseChart) {
        exerciseChart.data.labels = labels;
        exerciseChart.data.datasets[0].data = values;
        exerciseChart.update();
        return;
    }

    exerciseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Exercise Distribution'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} session(s)`;
                        }
                    }
                }
            }
        }
    });
};

// Initialize or update weekly summary chart
window.updateWeeklyChart = function(labels, data) {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    
    if (weeklyChart) {
        weeklyChart.data.labels = labels;
        weeklyChart.data.datasets[0].data = data;
        weeklyChart.update();
        return;
    }

    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Water Intake (ml)',
                data: data,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.1,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Milliliters (ml)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
};
