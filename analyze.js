function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

const expensesDisplay = document.getElementById('expensesDisplay');
const selectedMonthTitle = document.getElementById('selectedMonthTitle');
let chartInstance = null;

function populateMonthDropdown() {
    const dropdown = document.getElementById('analyzeMonthSelect');
    dropdown.innerHTML = '';
    for (let key in localStorage) {
        if (key.match(/^\d{4}-\d{2}$/)) {
            let option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            dropdown.appendChild(option);
        }
    }
}

populateMonthDropdown();

document.getElementById('analyzeMonthSelect').addEventListener('change', () => {
    const month = document.getElementById('analyzeMonthSelect').value;
    const data = JSON.parse(localStorage.getItem(month) || '[]');

    selectedMonthTitle.textContent = `📅 Month: ${month}`;
    expensesDisplay.innerHTML = '';

    if (!data.length) {
        expensesDisplay.innerHTML = '<p>No data available for this month.</p>';
        if (chartInstance) chartInstance.destroy();
        return;
    }

    const categorySums = {};

    data.forEach(entry => {
        const cat = entry.category || 'Other';
        categorySums[cat] = (categorySums[cat] || 0) + parseFloat(entry.amount);
    });

    renderChart(Object.keys(categorySums), Object.values(categorySums), 'Summary by Category', '#4CAF50');
});

document.getElementById('compareAllBtn').addEventListener('click', () => {
    const months = [];
    const totals = [];

    for (let key in localStorage) {
        if (key.match(/^\d{4}-\d{2}$/)) {
            const data = JSON.parse(localStorage.getItem(key));
            const total = data.reduce((sum, exp) => sum + Number(exp.amount), 0);
            months.push(key);
            totals.push(total);
        }
    }

    selectedMonthTitle.textContent = '📊 Comparison: All Months';
    expensesDisplay.innerHTML = '';

    renderChart(months, totals, 'Total Expenses per Month', '#2196F3');
});

function renderChart(labels, data, label, color) {
    const ctx = document.getElementById('monthChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: color
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {display: false}
            },
            scales: {
                y: {beginAtZero: true}
            }
        }
    });
}
