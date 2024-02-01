function initializeUserProfileGraph() {
    // Sample data for the chart (3 months, daily data)
    const chartData = {
        labels: Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`), // Assuming 3 months with 30 days each
        datasets: [
            {
                label: 'Unrealized Return',
                data: generateRandomData(90), // Replace this with your actual data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Realized Return',
                data: generateRandomData(90), // Replace this with your actual data
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    // Get the canvas element and create the chart
    const ctx = document.getElementById('user-chart').getContext('2d');
    const userChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to generate random data (replace with your actual data)
function generateRandomData(count) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 50) - 25); // Example: Random data between -25 and 25
}
