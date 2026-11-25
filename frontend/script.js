// SpendSense JavaScript
let totalExpenses = 0;
let expenseCount = 0;
let monthlyIncome = 0;
let monthlyBudget = 0;
let categoryExpenses = {};
let currentMonthExpenses = 0;
let previousMonthExpenses = 0;
let categoryBudgets = {};
function updateRemainingBalance() {
    let remaining = monthlyIncome - totalExpenses;

    document.getElementById("remainingBalance").textContent = "₹" + remaining;
    document.getElementById("monthlySavings").textContent =
    "₹" + remaining;

    document.getElementById("summaryIncome").textContent =
    "Income: ₹" + monthlyIncome;

document.getElementById("summaryExpenses").textContent =
    "Expenses: ₹" + totalExpenses;

document.getElementById("summarySavings").textContent =
    "Savings: ₹" + remaining;
    if (remaining < 0) {
    document.getElementById("summaryStatus").textContent =
        "🚨 Critical: Expenses are higher than your income.";
} else if (monthlyIncome > 0 && remaining <= monthlyIncome * 0.1) {
    document.getElementById("summaryStatus").textContent =
        "⚠️ Warning: Your savings are very low.";
} else {
    document.getElementById("summaryStatus").textContent =
        "💰 Good: You are maintaining positive savings.";
}
    if (monthlyIncome > 0) {
    let savingsRate = (remaining / monthlyIncome) * 100;

    savingsRate = Math.round(savingsRate * 10) / 10;

    document.getElementById("savingsRate").textContent =
        "Savings Rate: " + savingsRate + "%";
} else {
    document.getElementById("savingsRate").textContent =
        "Savings Rate: 0%";
}

    if (remaining < 0) {
    document.getElementById("spendingAlert").textContent =
        "⚠️ Warning: You have spent more than your income!";
} else {
    document.getElementById("spendingAlert").textContent = "";
}
}

function updateBudgetStatus() {
    if (monthlyBudget <= 0) {
        document.getElementById("budgetAlert").textContent = "";
        return;
    }

    let budgetUsed = (totalExpenses / monthlyBudget) * 100;
    let roundedBudgetUsed = Math.round(budgetUsed);

document.getElementById("budgetPercentage").textContent =
    "Budget Used: " + roundedBudgetUsed + "%";
    let progress = Math.min(budgetUsed, 100);

document.getElementById("budgetProgressBar").style.width =
    progress + "%";
    if (totalExpenses > monthlyBudget) {
        document.getElementById("budgetAlert").textContent =
            "⚠️ You have exceeded your monthly budget!";
    } else if (budgetUsed >= 90) {
        document.getElementById("budgetAlert").textContent =
            "⚠️ You have used 90% of your monthly budget!";
    } else {
        document.getElementById("budgetAlert").textContent = "";
    }
if (totalExpenses === 0) {
    document.getElementById("budgetAlert").textContent =
        "💰 No expenses recorded yet.";
} else if (totalExpenses < monthlyBudget * 0.5) {
    document.getElementById("budgetAlert").textContent =
        "✅ You are well within your budget.";
} else if (totalExpenses < monthlyBudget * 0.9) {
    document.getElementById("budgetAlert").textContent =
        "👍 Your spending is under control.";
}
    
}
function updateCategoryList() {
    let categoryList = document.getElementById("categoryList");

    categoryList.innerHTML = "";

    for (let category in categoryExpenses) {
        categoryList.innerHTML += `
            <p>
                ${category} - ₹${categoryExpenses[category]}
            </p>
        `;
    }
}

function updateSpendingComparison() {
    let difference = currentMonthExpenses - previousMonthExpenses;

    if (difference > 0) {
        document.getElementById("comparisonResult").textContent =
            "📈 Spending increased by ₹" + difference;
    } else if (difference < 0) {
        document.getElementById("comparisonResult").textContent =
            "📉 Spending decreased by ₹" + Math.abs(difference);
    } else {
        document.getElementById("comparisonResult").textContent =
            "Spending is the same as last month.";
    }
}

function savePreviousMonth() {
    let previousMonth = document.getElementById("previousMonthInput").value;

    if (previousMonth === "") {
        alert("Please enter previous month spending.");
        return;
    }

    previousMonthExpenses = Number(previousMonth);

    document.getElementById("previousMonthInput").value = "";

    document.getElementById("spendingComparison").children[1].textContent =
        "Previous Month: ₹" + previousMonthExpenses;

    updateSpendingComparison();

    alert("Previous month spending saved!");
}

async function saveSavingsGoal() {
    let goalName = document.getElementById("goalNameInput").value;
    let goalTarget = document.getElementById("goalTargetInput").value;
    let goalSaved = document.getElementById("goalSavedInput").value;

    if (goalName === "" || goalTarget === "" || goalSaved === "") {
        alert("Please enter all savings goal details.");
        return;
    }

    let remaining = Number(goalTarget) - Number(goalSaved);
    let progress = (Number(goalSaved) / Number(goalTarget)) * 100;

    if (progress > 100) {
        progress = 100;
    }

    progress = Math.round(progress);

    try {
        let userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/savings-goals?userId=" + userId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    goalName: goalName,
                    targetAmount: Number(goalTarget),
                    savedAmount: Number(goalSaved)
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save savings goal");
        }

        let savedGoal = await response.json();

        let savingsGoal = document.getElementById("savingsGoal");

        savingsGoal.children[0].textContent =
            "Goal: " + savedGoal.goalName;

        savingsGoal.children[1].textContent =
            "Target: ₹" + savedGoal.targetAmount;

        savingsGoal.children[2].textContent =
            "Saved: ₹" + savedGoal.savedAmount;

        savingsGoal.children[3].textContent =
            "Remaining: ₹" +
            (Number(savedGoal.targetAmount) - Number(savedGoal.savedAmount));

        document.getElementById("savingsProgress").textContent =
            "Progress: " + progress + "%";

        if (progress >= 100) {
            document.getElementById("savingsGoalStatus").textContent =
                "🎉 Goal achieved!";
        } else if (progress >= 50) {
            document.getElementById("savingsGoalStatus").textContent =
                "👍 You are halfway there!";
        } else {
            document.getElementById("savingsGoalStatus").textContent =
                "💪 Keep saving! You are making progress.";
        }

        document.getElementById("savingsProgressBar").style.width =
            progress + "%";

        document.getElementById("goalNameInput").value = "";
        document.getElementById("goalTargetInput").value = "";
        document.getElementById("goalSavedInput").value = "";

        alert("Savings goal saved successfully!");

    } catch (error) {
        console.error(error);
        alert("Could not connect to the backend.");
    }
}

async function saveUpcomingExpense() {
    let name = document.getElementById("upcomingExpenseName").value;
    let amount = document.getElementById("upcomingExpenseAmount").value;
    let date = document.getElementById("upcomingExpenseDate").value;

    if (name === "" || amount === "" || date === "") {
        alert("Please enter all upcoming expense details.");
        return;
    }

    try {
        let userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/upcoming-expenses?userId=" + userId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    expenseName: name,
                    amount: Number(amount),
                    date: date
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save upcoming expense");
        }

        let savedExpense = await response.json();

        document.getElementById("upcomingExpenseDisplay").textContent =
            "📅 " + savedExpense.expenseName +
            " - ₹" + savedExpense.amount +
            " - Due: " + savedExpense.date;

        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let dueDate = new Date(savedExpense.date);
        dueDate.setHours(0, 0, 0, 0);

        let status = "";

        if (dueDate.getTime() === today.getTime()) {
            status = "🔔 Due Today!";
        } else if (dueDate < today) {
            status = "⚠️ Overdue!";
        } else {
            status = "⏳ Upcoming Expense";
        }

        document.getElementById("upcomingExpenseStatus").textContent = status;

        document.getElementById("upcomingExpenseName").value = "";
        document.getElementById("upcomingExpenseAmount").value = "";
        document.getElementById("upcomingExpenseDate").value = "";

        alert("Upcoming expense saved successfully!");

    } catch (error) {
        console.error(error);
        alert("Could not connect to the backend.");
    }
}

async function saveProfile() {
    let name = document.getElementById("studentName").value;
    let age = document.getElementById("studentAge").value;

    if (name === "" || age === "") {
        alert("Please enter your name and age.");
        return;
    }

    try {
        let userId = localStorage.getItem("userId");

let response = await fetch(
    "http://localhost:8080/api/students?userId=" + userId,
    {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                age: Number(age)
            })
        });

        if (!response.ok) {
            throw new Error("Failed to save student");
        }

        let student = await response.json();

        document.getElementById("profileDisplay").textContent =
            "Name: " + student.name + " | Age: " + student.age;

        document.getElementById("studentName").value = "";
        document.getElementById("studentAge").value = "";

        alert("Profile saved to database successfully!");

    } catch (error) {
        console.error(error);
        alert("Could not connect to the backend.");
    }
}

function updateSpendingInsight() {
    let highestCategory = "";
    let highestAmount = 0;

    for (let category in categoryExpenses) {
        if (categoryExpenses[category] > highestAmount) {
            highestAmount = categoryExpenses[category];
            highestCategory = category;
        }
    }

    if (highestCategory === "") {
        document.getElementById("spendingInsight").innerHTML =
            "<p>No spending insight yet.</p>";
    } else {
        document.getElementById("spendingInsight").innerHTML =
            "<p>💡 " + highestCategory +
            " is your highest spending category: ₹" +
            highestAmount + "</p>";
    }
}

function addExpense() {
    document.getElementById("expenseForm").scrollIntoView();
}



    async function saveExpense() {
    let category = document.getElementById("expenseCategory").value;
    let amount = document.getElementById("expenseAmount").value;
    let date = document.getElementById("expenseDate").value;
    let description = document.getElementById("expenseDescription").value;

    if (category === "" || amount === "" || date === "" || description === "") {
        alert("Please select a category, enter amount, description, and date.");
        return;
    }

    try {
        let userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/expenses?userId=" + userId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    category: category,
                    amount: Number(amount),
                    description: description,
                    date: date
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save expense");
        }

        let savedExpense = await response.json();

        totalExpenses += Number(savedExpense.amount);
        expenseCount++;
        currentMonthExpenses += Number(savedExpense.amount);

        if (categoryExpenses[category]) {
            categoryExpenses[category] += Number(savedExpense.amount);
        } else {
            categoryExpenses[category] = Number(savedExpense.amount);
        }

        document.getElementById("totalExpenses").textContent =
            "₹" + totalExpenses;

        document.getElementById("currentMonthSpending").textContent =
            "Current Month: ₹" + currentMonthExpenses;

        updateRemainingBalance();

        document.getElementById("summaryExpenseCount").textContent =
            "Number of Expenses: " + expenseCount;

        document.getElementById("budgetRemaining").textContent =
            "Budget Remaining: ₹" + (monthlyBudget - totalExpenses);

        updateBudgetStatus();
        updateCategoryList();
        if (typeof updateSpendingChart === "function") {
    updateSpendingChart();
}
        updateSpendingComparison();
        updateSpendingInsight();

        let expenseList = document.getElementById("expenseList");

        if (expenseList.innerHTML.includes("No expenses added yet.")) {
            expenseList.innerHTML = "";
        }

        expenseList.innerHTML += `
            <p>
                📌 ${savedExpense.category}<br>
                💰 Amount: ₹${savedExpense.amount}<br>
                📝 ${savedExpense.description}<br>
                📅 Date: ${savedExpense.date}
            </p>
        `;

        alert("Expense saved to database successfully!");

        document.getElementById("expenseAmount").value = "";
        document.getElementById("expenseDate").value = "";
        document.getElementById("expenseDescription").value = "";

    } catch (error) {
        console.error(error);
        alert("Could not connect to the backend.");
    }
}
async function saveIncome() {
    let income = document.getElementById("incomeInput").value;

    if (income === "") {
        alert("Please enter your monthly income.");
        return;
    }

    try {
        let userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/incomes?userId=" + userId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: Number(income)
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save income");
        }

        let savedIncome = await response.json();

        monthlyIncome = Number(savedIncome.amount);

        document.getElementById("monthlyIncome").textContent =
            "₹" + monthlyIncome;

        updateRemainingBalance();

        document.getElementById("incomeInput").value = "";

        alert("Monthly income saved successfully!");

    } catch (error) {
        console.error(error);
        alert("Could not save income. Check the backend.");
    }
}
            

async function saveCategoryBudget() {
    let category = document.getElementById("budgetCategory").value;
    let amount = document.getElementById("categoryBudgetAmount").value;

    if (category === "" || amount === "") {
        alert("Please select a category and enter a budget.");
        return;
    }

    try {
        let userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/category-budgets?userId=" + userId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    category: category,
                    amount: Number(amount)
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save category budget");
        }

        let savedCategoryBudget = await response.json();

        categoryBudgets[savedCategoryBudget.category] =
            Number(savedCategoryBudget.amount);

        updateCategoryBudgetList();

        document.getElementById("budgetCategory").value = "";
        document.getElementById("categoryBudgetAmount").value = "";

        alert("Category budget saved successfully!");

    } catch (error) {
        console.error(error);
        alert("Could not connect to the backend.");
    }
}


function updateCategoryBudgetList() {

    let list = document.getElementById("categoryBudgetList");

    list.innerHTML = "";

    let categories = ["Food", "Travel", "Education", "Shopping", "Other"];

    categories.forEach(function(category) {

        let amount = categoryBudgets[category] || 0;

        list.innerHTML += `
            <p>
                ${category} Budget: ₹${amount}
            </p>
        `;

    });
}
async function registerUser() {

    let name = document.getElementById("registerName").value;
    let email = document.getElementById("registerEmail").value;
    let password = document.getElementById("registerPassword").value;

    if (name === "" || email === "" || password === "") {
        alert("Please enter all registration details.");
        return;
    }

    try {

        let response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        let user = await response.json();

        document.getElementById("authMessage").textContent =
            "Registration successful! You can now login.";

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";

        alert("Registration successful!");

    } catch (error) {

        console.error(error);

        document.getElementById("authMessage").textContent =
            "Registration failed. Email may already be registered.";

    }
}


async function loginUser() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }

    try {

        let response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        let user = await response.json();

        localStorage.setItem("userId", user.id);

        document.getElementById("authMessage").textContent =
            "Welcome, " + user.name + "!";

        document.getElementById("authSection").style.display = "none";
        document.getElementById("mainApp").style.display = "block";

        loadStudentProfile();
        loadIncome();
        loadExpenses();
        loadBudget();
        loadCategoryBudgets();
        loadSavingsGoals();
        loadUpcomingExpenses();

        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";

    } catch (error) {

        console.error(error);

        document.getElementById("authMessage").textContent =
            "Invalid email or password.";

        alert("Login failed. Please check your email and password.");

    }
}

function logoutUser() {

    localStorage.removeItem("userId");

    document.getElementById("mainApp").style.display = "none";
    document.getElementById("authSection").style.display = "block";

    alert("You have been logged out.");

}
function showForgotPassword() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("forgotPasswordSection").style.display = "block";
    document.getElementById("authMessage").textContent = "";
}

function hideForgotPassword() {
    document.getElementById("forgotPasswordSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("forgotMessage").textContent = "";
}

async function requestPasswordReset() {

    let email = document.getElementById("forgotEmail").value;

    if (email === "") {
        alert("Please enter your registered email.");
        return;
    }

    try {

        let response = await fetch(
            "http://localhost:8080/api/users/forgot-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email
                })
            }
        );

        let message = await response.text();

        document.getElementById("forgotMessage").textContent = message;

        if (response.ok && message.includes("Password reset request received")) {

            document.getElementById("newPassword").style.display = "block";

            document.querySelector(
                '#forgotPasswordSection button[onclick="resetPassword()"]'
            ).style.display = "inline-block";
        }

    } catch (error) {

        console.error(error);

        document.getElementById("forgotMessage").textContent =
            "Could not connect to the backend.";
    }
}
async function resetPassword() {

    let email = document.getElementById("forgotEmail").value;
    let newPassword = document.getElementById("newPassword").value;

    if (email === "" || newPassword === "") {
        alert("Please enter your email and new password.");
        return;
    }

    try {

        let response = await fetch(
            "http://localhost:8080/api/users/reset-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: newPassword
                })
            }
        );

        let message = await response.text();

        document.getElementById("forgotMessage").textContent = message;

        if (response.ok) {
            document.getElementById("newPassword").value = "";
        }

    } catch (error) {

        console.error(error);

        document.getElementById("forgotMessage").textContent =
            "Could not connect to the backend.";
    }
}

async function loadIncome() {

    try {

        let userId = localStorage.getItem("userId");

let response = await fetch(
    "http://localhost:8080/api/incomes?userId=" + userId
);

        if (!response.ok) {
            throw new Error("Failed to load income");
        }

        let incomes = await response.json();

        if (incomes.length > 0) {

            // Get the latest saved income
            let latestIncome = incomes[incomes.length - 1];

            monthlyIncome = Number(latestIncome.amount);

            document.getElementById("monthlyIncome").textContent =
                "₹" + monthlyIncome;

            updateRemainingBalance();
        }

    } catch (error) {

        console.error(error);

        console.log("Could not load income from database.");
    }
}
async function loadExpenses() {

    try {

        let userId = localStorage.getItem("userId");

        if (!userId) {
            console.log("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/expenses?userId=" + userId
        );

        if (!response.ok) {
            throw new Error("Failed to load expenses");
        }

        let expenses = await response.json();

        totalExpenses = 0;
        expenseCount = 0;
        currentMonthExpenses = 0;
        categoryExpenses = {};

        let expenseList = document.getElementById("expenseList");
        expenseList.innerHTML = "";

        if (expenses.length === 0) {

            expenseList.innerHTML =
                "<p>No expenses added yet.</p>";

        } else {

            expenses.forEach(function(expense) {

                totalExpenses += Number(expense.amount);
                expenseCount++;
                currentMonthExpenses += Number(expense.amount);

                if (categoryExpenses[expense.category]) {
                    categoryExpenses[expense.category] +=
                        Number(expense.amount);
                } else {
                    categoryExpenses[expense.category] =
                        Number(expense.amount);
                }

                expenseList.innerHTML += `
                    <p>
                        📌 ${expense.category}<br>
                        💰 Amount: ₹${expense.amount}<br>
                        📝 ${expense.description}<br>
                        📅 Date: ${expense.date}
                    </p>
                `;
            });
        }

        document.getElementById("totalExpenses").textContent =
            "₹" + totalExpenses;

        document.getElementById("currentMonthSpending").textContent =
            "Current Month: ₹" + currentMonthExpenses;

        document.getElementById("summaryExpenseCount").textContent =
            "Number of Expenses: " + expenseCount;

        document.getElementById("budgetRemaining").textContent =
            "Budget Remaining: ₹" +
            (monthlyBudget - totalExpenses);

        updateRemainingBalance();
        updateBudgetStatus();
        updateCategoryList();
        if (typeof updateSpendingChart === "function") {
    updateSpendingChart();
}
        updateSpendingComparison();
        updateSpendingInsight();

    } catch (error) {

        console.error(error);
        console.log("Could not load expenses from database.");
    }
}
async function loadBudget() {
    try {
        let userId = localStorage.getItem("userId");

        if (!userId) {
            console.log("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/budgets?userId=" + userId
        );

        if (!response.ok) {
            throw new Error("Failed to load budget");
        }

        let budgets = await response.json();

        if (budgets.length > 0) {
            let latestBudget = budgets[budgets.length - 1];

            monthlyBudget = Number(latestBudget.amount);

            document.getElementById("monthlyBudget").textContent =
                "₹" + monthlyBudget;

            document.getElementById("budgetRemaining").textContent =
                "Budget Remaining: ₹" + (monthlyBudget - totalExpenses);

            updateBudgetStatus();
            updateRemainingBalance();

        } else {
            monthlyBudget = 0;

            document.getElementById("monthlyBudget").textContent = "₹0";

            document.getElementById("budgetRemaining").textContent =
                "Budget Remaining: ₹" + (monthlyBudget - totalExpenses);
        }

    } catch (error) {
        console.error(error);
        console.log("Could not load budget from database.");
    }
}
async function loadCategoryBudgets() {

    try {

        let userId = localStorage.getItem("userId");

        if (!userId) {
            console.log("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/category-budgets?userId=" + userId
        );

        if (!response.ok) {
            throw new Error("Failed to load category budgets");
        }

        let budgets = await response.json();

        categoryBudgets = {};

        budgets.forEach(function(budget) {

            categoryBudgets[budget.category] =
                Number(budget.amount);

        });

        updateCategoryBudgetList();

    } catch (error) {

        console.error(error);

        console.log("Could not load category budgets from database.");
    }
}
async function loadStudentProfile() {

    // Clear previous account's details first
    document.getElementById("studentName").value = "";
    document.getElementById("studentAge").value = "";
    document.getElementById("profileDisplay").textContent = "";

    try {

        let userId = localStorage.getItem("userId");

        let response = await fetch(
            "http://localhost:8080/api/students?userId=" + userId
        );

        if (!response.ok) {
            throw new Error("Failed to load student profile");
        }

        let responseText = await response.text();

        if (responseText.trim() === "") {
            console.log("No student profile found for this account.");
            return;
        }

        let student = JSON.parse(responseText);

        if (student) {
            document.getElementById("studentName").value = student.name;
            document.getElementById("studentAge").value = student.age;

            document.getElementById("profileDisplay").textContent =
                "Name: " + student.name + " | Age: " + student.age;
        }

    } catch (error) {
        console.error(error);
    }
}
async function saveBudget() {

    let amount = document.getElementById("budgetInput").value;

    if (amount === "") {
        alert("Please enter your monthly budget.");
        return;
    }

    try {

        let userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please login again.");
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/budgets?userId=" + userId,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: Number(amount)
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save budget");
        }

        let savedBudget = await response.json();

        monthlyBudget = Number(savedBudget.amount);

        document.getElementById("monthlyBudget").textContent =
            "₹" + monthlyBudget;

        document.getElementById("budgetInput").value = "";

        document.getElementById("budgetRemaining").textContent =
            "Budget Remaining: ₹" + (monthlyBudget - totalExpenses);

        updateBudgetStatus();
        updateRemainingBalance();

        alert("Monthly budget saved successfully!");

    } catch (error) {

        console.error(error);
        alert("Could not save budget. Check the backend.");

    }
}
async function loadSavingsGoals() {

    try {

        // Clear previous account's savings details
        let savingsGoal = document.getElementById("savingsGoal");

        savingsGoal.children[0].textContent = "Goal: None";
        savingsGoal.children[1].textContent = "Target: ₹0";
        savingsGoal.children[2].textContent = "Saved: ₹0";
        savingsGoal.children[3].textContent = "Remaining: ₹0";

        document.getElementById("savingsProgress").textContent =
            "Progress: 0%";

        document.getElementById("savingsGoalStatus").textContent =
            "Start saving towards your goal!";

        document.getElementById("savingsProgressBar").style.width =
            "0%";

        let userId = localStorage.getItem("userId");

        if (!userId) {
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/savings-goals?userId=" + userId
        );

        if (!response.ok) {
            throw new Error("Failed to load savings goals");
        }

        let goals = await response.json();

        if (goals.length === 0) {
            return;
        }

        let goal = goals[goals.length - 1];

        let progress = (Number(goal.savedAmount) /
            Number(goal.targetAmount)) * 100;

        progress = Math.min(Math.round(progress), 100);

        savingsGoal.children[0].textContent =
            "Goal: " + goal.goalName;

        savingsGoal.children[1].textContent =
            "Target: ₹" + goal.targetAmount;

        savingsGoal.children[2].textContent =
            "Saved: ₹" + goal.savedAmount;

        savingsGoal.children[3].textContent =
            "Remaining: ₹" +
            (Number(goal.targetAmount) - Number(goal.savedAmount));

        document.getElementById("savingsProgress").textContent =
            "Progress: " + progress + "%";

        if (progress >= 100) {
            document.getElementById("savingsGoalStatus").textContent =
                "🎉 Goal achieved!";
        } else if (progress >= 50) {
            document.getElementById("savingsGoalStatus").textContent =
                "👍 You are halfway there!";
        } else {
            document.getElementById("savingsGoalStatus").textContent =
                "💪 Keep saving! You are making progress.";
        }

        document.getElementById("savingsProgressBar").style.width =
            progress + "%";

    } catch (error) {

        console.error(error);
        console.log("Could not load savings goals.");

    }
}
async function loadUpcomingExpenses() {

    // Clear previous account's details
    document.getElementById("upcomingExpenseDisplay").textContent =
        "No upcoming expense added.";

    document.getElementById("upcomingExpenseStatus").textContent = "";

    try {

        let userId = localStorage.getItem("userId");

        if (!userId) {
            return;
        }

        let response = await fetch(
            "http://localhost:8080/api/upcoming-expenses?userId=" + userId
        );

        if (!response.ok) {
            throw new Error("Failed to load upcoming expenses");
        }

        let expenses = await response.json();

        if (expenses.length === 0) {
            return;
        }

        let expense = expenses[expenses.length - 1];

        document.getElementById("upcomingExpenseDisplay").textContent =
            "📅 " + expense.expenseName +
            " - ₹" + expense.amount +
            " - Due: " + expense.date;

        let today = new Date();

        let todayString =
            today.getFullYear() + "-" +
            String(today.getMonth() + 1).padStart(2, "0") + "-" +
            String(today.getDate()).padStart(2, "0");

        let status = "";

        if (expense.date === todayString) {
            status = "🔔 Due Today!";
        } else if (expense.date < todayString) {
            status = "⚠️ Overdue!";
        } else {
            status = "⏳ Upcoming Expense";
        }

        document.getElementById("upcomingExpenseStatus").textContent =
            status;

    } catch (error) {

        console.error("Error loading upcoming expenses:", error);

    }
}
window.addEventListener("DOMContentLoaded", function () {

    let userId = localStorage.getItem("userId");

    if (userId) {

        document.getElementById("authSection").style.display = "none";
        document.getElementById("mainApp").style.display = "block";

        loadStudentProfile();
        loadIncome();
        loadExpenses();
        loadBudget();
        loadCategoryBudgets();
        loadSavingsGoals();
        loadUpcomingExpenses();
    }

});