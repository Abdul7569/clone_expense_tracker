// Global variables for income
let hourlyWage = 0;
let weeklyHours = 0;

// Array to hold expense data
let expenses = [];

// Array to hold debt data
let debts = [];

// Function to save income information
function setIncome() {
    hourlyWage = parseFloat(document.getElementById('hourlyWage').value);
    weeklyHours = parseFloat(document.getElementById('weeklyHours').value);

    // Validate inputs
    if (isNaN(hourlyWage) || isNaN(weeklyHours) || hourlyWage <= 0 || weeklyHours <= 0) {
        alert('Please enter valid numbers for hourly wage and weekly hours.');
        return;
    }

    // Clear the form
    document.getElementById('income-form').reset();
    alert('Income information saved.');
}

// Function to handle form submission for adding a debt
function addDebt() {
    if (hourlyWage <= 0 || weeklyHours <= 0) {
        alert('Please enter your income information first.');
        return;
    }

    const description = document.getElementById('debt-description').value;
    const amount = parseFloat(document.getElementById('debt-amount').value);

    // Validate the amount
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    // Add debt to the array
    debts.push({ description, amount });

    // Clear the form
    document.getElementById('debt-description').value = '';
    document.getElementById('debt-amount').value = '';

    // Update the debt list
    updateDebtList();
}

// Function to update the debt list
function updateDebtList() {
    const debtList = document.getElementById('debt-list');
    debtList.innerHTML = ''; // Clear existing items

    let totalDebt = 0;

    debts.forEach(debt => {
        const listItem = document.createElement('li');
        listItem.textContent = `${debt.description}: $${debt.amount.toFixed(2)}`;
        debtList.appendChild(listItem);
        totalDebt += debt.amount;
    });

    // Add total debt item
    const totalDebtItem = document.createElement('li');
    totalDebtItem.innerHTML = `<strong>Total Debt: $${totalDebt.toFixed(2)}</strong>`;
    debtList.appendChild(totalDebtItem);
}

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
});

// Function to update the expenses table
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

    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td><strong>$${totalExpenses.toFixed(2)}</strong></td>
        <td></td>
    `;
    tableBody.appendChild(totalRow);
}

// Function to calculate debt repayment time
function calculateRepaymentTime() {
    if (hourlyWage <= 0 || weeklyHours <= 0) {
        alert('Please enter your income information first.');
        return;
    }

    // Calculate weekly and monthly income
    const weeklyIncome = hourlyWage * weeklyHours;
    const monthlyIncome = 4 * weeklyIncome; // Approximate monthly income

    // Calculate total debt from the debts array
    let totalDebt = debts.reduce((acc, debt) => acc + debt.amount, 0);

    // Calculate total expenses from the expenses array
    let totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    // Calculate net monthly income after deducting expenses
    const netMonthlyIncome = monthlyIncome - totalExpenses;

    // Check if net monthly income is positive
    if (netMonthlyIncome <= 0) {
        document.getElementById('repayment-result').textContent = 'Your expenses are greater than or equal to your income. Cannot calculate repayment time'
        return;
    }

    // Calculate exact repayment time
    const repaymentTimeMonths = totalDebt / netMonthlyIncome;
    const repaymentTimeWeeks = repaymentTimeMonths * (365.25 / 12 / 7); // Convert months to weeks
    const repaymentTimeDays = repaymentTimeWeeks * 7; // Convert weeks to days

    // Display the result
    const resultText = `
        To repay your debt:
        - ${repaymentTimeMonths.toFixed(2)} months
        - ${repaymentTimeWeeks.toFixed(2)} weeks
        - ${repaymentTimeDays.toFixed(2)} days
    `;
    document.getElementById('repayment-result').textContent = resultText;
}