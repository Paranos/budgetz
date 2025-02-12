document.addEventListener("DOMContentLoaded", loadTransactions);

function loadTransactions() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    if (!account) {
        alert("Compte introuvable !");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("transactions-title").textContent = `Transactions de ${account.name}`;

    updateBeneficiaryList();
    displayTransactions(account);
}

function editTransaction(index) {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    let transaction = account.transactions[index];

    // Pré-remplir les champs du formulaire de modification
    document.getElementById("transaction-description").value = transaction.description;
    document.getElementById("transaction-date").value = transaction.date;
    document.getElementById("transaction-amount").value = transaction.amount;
    document.getElementById("transaction-beneficiary").value = transaction.beneficiary || "";
    document.getElementById("transaction-category").value = transaction.category || "";

    // Stocker l'index de la transaction en cours de modification
    document.getElementById("edit-transaction-index").value = index;

    // Ouvrir la fenêtre de modification
    openTransactionModal(true);
}

function saveTransaction() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    let index = document.getElementById("edit-transaction-index").value;

    let updatedTransaction = {
        description: document.getElementById("transaction-description").value.trim(),
        date: document.getElementById("transaction-date").value,
        amount: parseFloat(document.getElementById("transaction-amount").value),
        beneficiary: document.getElementById("transaction-beneficiary").value,
        category: document.getElementById("transaction-category").value
    };

    // Vérifier si on modifie ou ajoute une nouvelle transaction
    if (index !== "") {
        account.transactions[index] = updatedTransaction; // Modification
    } else {
        account.transactions.push(updatedTransaction); // Ajout
    }

    // Sauvegarde
    localStorage.setItem("accounts", JSON.stringify(accounts));

    // Fermer la fenêtre modale
    closeTransactionModal();

    // Rafraîchir la liste des transactions
    loadTransactions();
}

function deleteTransaction(index) {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    // Supprimer la transaction à l'index donné
    account.transactions.splice(index, 1);

    // Sauvegarde
    localStorage.setItem("accounts", JSON.stringify(accounts));

    // Rafraîchir la liste des transactions
    loadTransactions();
}

function displayTransactions(account) {
    let transactionList = document.getElementById("transactions-list");
    transactionList.innerHTML = "";

    account.transactions.forEach((transaction, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount.toFixed(2)} €</td>
            <td>${transaction.beneficiary || "N/A"}</td>
            <td>${transaction.category || "N/A"}</td>
            <td>
                <button class="btn-edit" onclick="editTransaction(${index})">Modifier</button>
                <button class="btn-delete" onclick="deleteTransaction(${index})">Supprimer</button>
            </td>
        `;
        transactionList.appendChild(row);
    });
}

function openTransactionModal() {
    document.getElementById("transaction-modal").style.display = "block";
}

function closeTransactionModal() {
    document.getElementById("transaction-modal").style.display = "none";
}

function openBeneficiaryModal() {
    document.getElementById("beneficiary-modal").style.display = "block";
}

function closeBeneficiaryModal() {
    document.getElementById("beneficiary-modal").style.display = "none";
}

function addTransaction() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    let description = document.getElementById("transaction-description").value;
    let amount = parseFloat(document.getElementById("transaction-amount").value);
    let date = document.getElementById("transaction-date").value;
    let beneficiary = document.getElementById("transaction-beneficiary").value;
    let category = document.getElementById("transaction-category").value;

    if (!description || isNaN(amount) || !date || !beneficiary || !category) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    account.transactions.push({ description, amount, date, beneficiary, category });
    account.balance += amount;

    localStorage.setItem("accounts", JSON.stringify(accounts));
    closeTransactionModal();
    loadTransactions();
}

function updateBeneficiaryList() {
    let beneficiaries = JSON.parse(localStorage.getItem("beneficiaries")) || [];
    let select = document.getElementById("transaction-beneficiary");

    select.innerHTML = '<option value="">Sélectionner un bénéficiaire</option>';
    beneficiaries.forEach(beneficiary => {
        let option = document.createElement("option");
        option.value = beneficiary.name;
        option.textContent = beneficiary.name;
        select.appendChild(option);
    });
}

function addBeneficiary() {
    let newBeneficiary = document.getElementById("new-beneficiary").value.trim();

    if (!newBeneficiary) {
        alert("Veuillez entrer un nom de bénéficiaire.");
        return;
    }

    let beneficiaries = JSON.parse(localStorage.getItem("beneficiaries")) || [];

    if (beneficiaries.includes(newBeneficiary)) {
        alert("Ce bénéficiaire existe déjà.");
        return;
    }

    beneficiaries.push(newBeneficiary);
    localStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));

    closeBeneficiaryModal();
    updateBeneficiaryList();
}

function goToAccount() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");
    window.location.href = `account.html?id=${accountId}`;
}


//import de masse
function handleQIFImport(event) {
    const file = event.target.files[0];
    if (!file || !file.name.endsWith(".qif")) {
        alert("Veuillez sélectionner un fichier QIF valide.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const qifData = e.target.result;
        parseAndImportQIF(qifData);
    };
    reader.readAsText(file);
}

function parseAndImportQIF(qifData) {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get("id");
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let account = accounts[accountId];

    const transactions = qifData.split("\n");
    let newTransactions = [];
    let transaction = {};

    transactions.forEach(line => {
        if (line.startsWith("D")) {
            transaction.date = formatDate(line.substring(1).trim());
        } else if (line.startsWith("T")) {
            transaction.amount = parseFloat(line.substring(1).trim());
        } else if (line.startsWith("P")) {
            transaction.description = line.substring(1).trim();
        } else if (line === "^") {
            if (!isDuplicate(account.transactions, transaction)) {
                transaction.beneficiary = "";
                transaction.category = "";
                newTransactions.push(transaction);
            }
            transaction = {};
        }
    });

    account.transactions = [...account.transactions, ...newTransactions];
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert(`${newTransactions.length} transactions importées avec succès !`);
    displayTransactions(); // Met à jour l'affichage
}

function isDuplicate(existingTransactions, newTransaction) {
    return existingTransactions.some(t => 
        t.date === newTransaction.date &&
        t.amount === newTransaction.amount &&
        t.description === newTransaction.description
    );
}

function formatDate(qifDate) {
    // Format attendu dans QIF : MM/DD/YYYY ou M/D/YY
    let parts = qifDate.split("/");
    if (parts[2].length === 2) {
        parts[2] = "20" + parts[2]; // Convertir YY en YYYY (ex: 24 -> 2024)
    }
    return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`; // YYYY-MM-DD
}
