document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('expensesInput');
    const category = document.getElementById('expensesOptions');
    const addBtn = document.getElementById('addBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const summary = document.getElementById('summaryExpenses');
    const monthSelect = document.getElementById('monthSelect');

    const columns = {
        Dormitory: document.getElementById('dormitoryColumn'),
        Meals: document.getElementById('mealsColumn'),
        Things: document.getElementById('thingsColumn'),
        Other: document.getElementById('otherColumn'),
        ExtraLesson: document.getElementById('extraLessonColumn'),
    };

    const totals = {
        Dormitory: document.getElementById('totalDormitory'),
        Meals: document.getElementById('totalMeals'),
        Things: document.getElementById('totalThings'),
        Other: document.getElementById('totalOther'),
        ExtraLesson: document.getElementById('totalExtraLesson'),
    };

    function getSelectedMonthExpenses() {
        const selectedMonth = monthSelect.value;
        return JSON.parse(localStorage.getItem(selectedMonth)) || [];
    }

    function saveSelectedMonthExpenses(expenses) {
        const selectedMonth = monthSelect.value;
        localStorage.setItem(selectedMonth, JSON.stringify(expenses));
    }

    function renderExpenses() {
        const selectedMonthExpenses = getSelectedMonthExpenses();
        Object.values(columns).forEach(col => col.innerHTML = '');

        let sum = 0;
        let categorySums = {
            Dormitory: 0,
            Meals: 0,
            Things: 0,
            Other: 0,
            ExtraLesson: 0
        };

        selectedMonthExpenses.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${item.amount} zł – ${item.date}`;
            columns[item.category].appendChild(li);

            categorySums[item.category] += parseFloat(item.amount);
            sum += parseFloat(item.amount);
        });

        for (let cat in totals) {
            totals[cat].textContent = `Total ${cat}: ${categorySums[cat]} zł`;
        }

        summary.textContent = `Summary: ${sum.toFixed(2)} zł`;
    }

    addBtn.addEventListener('click', () => {
        const amount = input.value.trim();
        const selectedCategory = category.value;
        const selectedMonth = monthSelect.value;

        if (!amount || isNaN(amount) || !selectedCategory || !selectedMonth) {
            alert("Please enter a valid amount, category, and month.");
            return;
        }

        const today = new Date();
        const fakeDate = `${selectedMonth}-01`; // or you can use today.toISOString().slice(0, 10);

        const newExpense = {
            amount,
            date: fakeDate,
            category: selectedCategory
        };

        let currentExpenses = getSelectedMonthExpenses();
        currentExpenses.push(newExpense);
        saveSelectedMonthExpenses(currentExpenses);
        renderExpenses();

        input.value = '';
    });

    deleteBtn.addEventListener('click', () => {
        const currentExpenses = getSelectedMonthExpenses();
        if (currentExpenses.length === 0) {
            alert("No expenses to delete.");
            return;
        }

        const deleteIndex = prompt(`Enter the number (1 to ${currentExpenses.length}) of the expense you want to delete:`);
        const index = parseInt(deleteIndex) - 1;

        if (isNaN(index) || index < 0 || index >= currentExpenses.length) {
            alert("Invalid number.");
            return;
        }

        currentExpenses.splice(index, 1);
        saveSelectedMonthExpenses(currentExpenses);
        renderExpenses();
    });

    monthSelect.addEventListener('change', () => {
        renderExpenses();
    });

    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    renderExpenses();
});
