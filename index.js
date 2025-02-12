document.addEventListener("DOMContentLoaded", loadAccounts);

function loadAccounts() {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let accountsList = document.getElementById("accounts-list");
    accountsList.innerHTML = "";

    accounts.forEach((account, index) => {
        let accountDiv = document.createElement("div");
        accountDiv.classList.add("account");
        accountDiv.innerHTML = `
            <span>${account.name} - ${account.balance}€</span>
            <a href="account.html?id=${index}" class="btn">Voir</a>
            <button class="delete-btn" onclick="confirmDelete(${index})">❌</button>
        `;
        accountsList.appendChild(accountDiv);
    });
}

function openModal() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function addAccount() {
    let name = document.getElementById("account-name").value;
    if (!name) return;
    
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    accounts.push({ name: name, balance: 0, transactions: [], categories: [] });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    closeModal();
    loadAccounts();
}

function confirmDelete(index) {
    document.getElementById("delete-modal").style.display = "block";
    document.getElementById("confirm-delete").onclick = function() {
        deleteAccount(index);
    };
}

function closeDeleteModal() {
    document.getElementById("delete-modal").style.display = "none";
}

function deleteAccount(index) {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    accounts.splice(index, 1);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    closeDeleteModal();
    loadAccounts();
}

function goToBeneficiaries() {
    window.location.href = "beneficiaries.html";
}
