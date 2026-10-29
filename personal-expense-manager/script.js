
console.log("Welcome to Personal Expense Manager!");
alert("Welcome! Let's track your expenses.");

// Load saved expenses
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editingIndex = null;

// Select HTML elements
let form = document.getElementById("expense-form");
let expenseList = document.getElementById("expense-list");
let totalElement = document.getElementById("total");
let submitButton = form.querySelector('button[type="submit"]');

// Save expenses in LocalStorage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Display expenses and calculate total
function renderExpenses() {
    expenseList.innerHTML = "";
    let total = 0;

    if (expenses.length === 0) {
        expenseList.textContent = "No expenses added yet.";
    }

    let searchText = document.getElementById("search-expense").value.toLowerCase();
let selectedCategory = document.getElementById("filter-category").value;

let filteredExpenses = expenses.filter(function(expense) {
    let matchesTitle = expense.name.toLowerCase().includes(searchText);
    let matchesCategory = selectedCategory === "All" ||
                          expense.category === selectedCategory;

    return matchesTitle && matchesCategory;
});

filteredExpenses.forEach(function(expense) {
    let index = expenses.indexOf(expense);
        let item = document.createElement("div");
        let details = document.createElement("p");

        details.textContent =
            expense.name + " - ₹" + expense.amount +
            " | Category: " + expense.category +
            " | Date: " + expense.date;

        item.appendChild(details);

        // Edit button
        let editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            document.getElementById("title").value = expense.name;
            document.getElementById("amount").value = expense.amount;
            document.getElementById("category").value = expense.category;
            document.getElementById("date").value = expense.date;

            editingIndex = index;
            submitButton.textContent = "Update Expense";
        });

        item.appendChild(editButton);

        // Delete button
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            expenses.splice(index, 1);

            if (editingIndex === index) {
                editingIndex = null;
                form.reset();
                submitButton.textContent = "Add Expense";
            } else if (editingIndex !== null && index < editingIndex) {
                editingIndex--;
            }

            saveExpenses();
            renderExpenses();
        });

        item.appendChild(deleteButton);
        expenseList.appendChild(item);

        total = total + Number(expense.amount);
    });

    totalElement.textContent = "₹" + total;
    
let categorySummary = document.getElementById("category-summary");
categorySummary.innerHTML = "";

let categoryTotals = {};

expenses.forEach(function(expense) {
    if (categoryTotals[expense.category] === undefined) {
        categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] += Number(expense.amount);
});

for (let category in categoryTotals) {
    let p = document.createElement("p");
    p.textContent = category + ": ₹" + categoryTotals[category];
    categorySummary.appendChild(p);
}

}
document.getElementById("search-expense").addEventListener("input", renderExpenses);
document.getElementById("filter-category").addEventListener("change", renderExpenses);

// Add or update expense
form.addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("title").value.trim();
    let amount = Number(document.getElementById("amount").value);
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;

    if (name === "" || amount <= 0 || !category || !date) {
        alert("Please fill all fields correctly.");
        return;
    }

    let expense = {
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    if (editingIndex === null) {
        expenses.push(expense);
    } else {
        expenses[editingIndex] = expense;
        editingIndex = null;
    }

    saveExpenses();
    renderExpenses();

    form.reset();
    submitButton.textContent = "Add Expense";
});

// Show saved expenses when page opens
renderExpenses();
