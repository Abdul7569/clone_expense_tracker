document.addEventListener('DOMContentLoaded', function() {
    // Global variables for income
    let hourlyWage = 0;
    let weeklyHours = 0;

    // Arrays to hold expense and debt data
    let expenses = [];
    let debts = [];
    // Function to handle user form submission
    document.getElementById('user-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const mobileNumber = document.getElementById('mobile-number').value;

        // Mobile number validation
        if (!/^\d{10}$/.test(mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }

        fetch('http://localhost:5000/submit_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                mobile_number: mobileNumber
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User Success:', data);
            document.getElementById('user-form').reset();
        })
        .catch((error) => {
            console.error('User Error:', error);
        });
    });

    // Add event listeners and other functions here...
    // Function to handle form submission for adding an expense
document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get values from the form
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    // Make a POST request to the backend to save the expense
    fetch('http://localhost:5000/submit_expense', {  // Replace with your Flask endpoint for expenses
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            amount: amount,
            category: category
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            // Clear the form
            document.getElementById('expense-form').reset();
            alert('Expense added successfully!');
            // Optionally, update the expenses table here if necessary
        }
    })
    .catch((error) => {
        console.error('Expense Error:', error);
        alert('Failed to add expense.');
    });
});
// Function to handle form submission for adding an expense
document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get values from the form
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    // Add expense to the array
    expenses.push({ description, amount, category });

    // Clear the form
    document.getElementById('expense-form').reset();

    // Update the expenses table
    updateExpensesTable();

    // Calculate and save total expenses
    calculateAndSaveTotal();
});

// Function to update the expenses table in the UI
function updateExpensesTable() {
    const tableBody = document.querySelector('#expenses-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    let totalExpenses = 0;

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
        `;
        tableBody.appendChild(row);
        totalExpenses += expense.amount;
    });

    // Add total row to the table
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td><strong>$${totalExpenses.toFixed(2)}</strong></td>
        <td></td>
    `;
    tableBody.appendChild(totalRow);
}

// Function to calculate the total expenses and save it to the database
function calculateAndSaveTotal() {
    // Calculate total expenses
    let totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    // Send total expenses to the backend
    fetch('http://localhost:5000/save_total', {  // Ensure this matches your Flask endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            total: totalExpenses
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Total Success:', data.message);
    })
    .catch((error) => {
        console.error('Total Error:', error);
    });
}
document.getElementById('income-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get values from the form
    hourlyWage = parseFloat(document.getElementById('hourlyWage').value);
    weeklyHours = parseFloat(document.getElementById('weeklyHours').value);

    // Validate inputs
    if (isNaN(hourlyWage) || isNaN(weeklyHours) || hourlyWage <= 0 || weeklyHours <= 0) {
        alert('Please enter valid numbers for hourly wage and weekly hours.');
        return;
    }

    // Calculate monthly income
    const monthlyIncome = calculateMonthlyIncome();

    // Clear the form
    document.getElementById('income-form').reset();

    // Display confirmation
    alert(`Income information saved. Monthly Income: $${monthlyIncome.toFixed(2)}`);

    // Optional: Send income data to the backend to save in the database
    saveIncomeToDatabase(hourlyWage, weeklyHours, monthlyIncome);
});

// Function to calculate monthly income based on hourly wage and weekly hours
function calculateMonthlyIncome() {
    const weeklyIncome = hourlyWage * weeklyHours;
    const monthlyIncome = weeklyIncome * 4; // Approximate 4 weeks in a month
    return monthlyIncome;
}

// Function to save income data to the backend (optional)
function saveIncomeToDatabase(hourlyWage, weeklyHours, monthlyIncome) {
    fetch('http://localhost:5000/save_income', {  // Adjust this to your Flask backend endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hourly_wage: hourlyWage,
            weekly_hours: weeklyHours,
            monthly_income: monthlyIncome
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Income Success:', data.message);
    })
    .catch((error) => {
        console.error('Income Error:', error);
    });
}

})