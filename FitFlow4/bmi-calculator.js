const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual API key

document.addEventListener('DOMContentLoaded', function() {
    const bmiForm = document.getElementById('bmiForm');
    const resultDisplay = document.getElementById('bmiResult');

    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            resultDisplay.innerHTML = '<p class="error">Please enter valid height and weight.</p>';
            return;
        }

        const bmi = (weight / (height * height)).toFixed(2);
        resultDisplay.innerHTML = `<p>Your BMI is: ${bmi}</p>`;
        
        // Call Google API for health recommendations
        fetch(`https://healthcare.googleapis.com/v1/bmi?weight=${weight}&height=${height}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                // Process and display health recommendations
                const recommendations = data.recommendations || [];
                const recommendationsList = recommendations.map(rec => `<li>${rec}</li>`).join('');
                document.getElementById('healthRecommendations').innerHTML = recommendationsList;
            })
            .catch(error => {
                console.error('Error fetching health recommendations:', error);
                resultDisplay.innerHTML += '<p class="error">Failed to fetch health recommendations.</p>';
            });
    });
});
