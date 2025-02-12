document.addEventListener("DOMContentLoaded", loadAccount);

document.addEventListener("DOMContentLoaded", loadAccount);

function loadAccount() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    if (!account) {
        alert("Compte introuvable !");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("account-title").textContent = `Compte : ${account.name}`;

    let totalBalance = account.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    document.getElementById("total-balance").textContent = `Solde total : ${totalBalance.toFixed(2)} €`;

    populateYearSelector();
    filterTransactions();
}

function populateYearSelector() {
    let yearSelect = document.getElementById("year");
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= currentYear - 10; i--) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    yearSelect.value = currentYear;
}

function filterTransactions() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    let selectedMonth = document.getElementById("month").value;
    let selectedYear = document.getElementById("year").value;

    let filteredTransactions = account.transactions.filter(transaction => {
        let transactionDate = new Date(transaction.date);
        let transactionMonth = transactionDate.getMonth() + 1;
        let transactionYear = transactionDate.getFullYear();

        if (selectedMonth === "all") {
            return transactionYear === parseInt(selectedYear);
        } else {
            return transactionMonth === parseInt(selectedMonth) && transactionYear === parseInt(selectedYear);
        }
    });

    displayCategories(account, filteredTransactions);
}

function displayCategories(account, transactions) {
    let incomeCategories = document.getElementById("income-categories");
    let expenseCategories = document.getElementById("expense-categories");

    incomeCategories.innerHTML = "";
    expenseCategories.innerHTML = "";

    let categoryTotals = {};

    transactions.forEach(transaction => {
        if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
    });

    for (let category in categoryTotals) {
        let card = document.createElement("div");
        card.classList.add("category-card");

        let name = document.createElement("span");
        name.textContent = category;

        let amount = document.createElement("span");
        amount.textContent = `${categoryTotals[category].toFixed(2)} €`;

        if (categoryTotals[category] >= 0) {
            card.classList.add("category-income");
        } else {
            card.classList.add("category-expense");
        }

        card.appendChild(name);
        card.appendChild(amount);

        if (categoryTotals[category] >= 0) {
            incomeCategories.appendChild(card);
        } else {
            expenseCategories.appendChild(card);
        }
    }
}

function goToTransactions() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");
    window.location.href = `transactions.html?id=${accountId}`;
}

function goToHome() {
    window.location.href = "index.html";
}

function openCategoryModal() {
    document.getElementById("category-modal").style.display = "block";
}

function closeCategoryModal() {
    document.getElementById("category-modal").style.display = "none";
}

function addCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    if (!account) return;

    let name = document.getElementById("category-name").value.trim();
    let type = document.getElementById("category-type").value;

    if (!name) return;

    account.categories.push({ name, type });
    localStorage.setItem("accounts", JSON.stringify(accounts));

    closeCategoryModal();
    loadAccountDetails();
}
