document.addEventListener("DOMContentLoaded", loadBeneficiaries);

let beneficiaries = JSON.parse(localStorage.getItem("beneficiaries")) || [];

function loadBeneficiaries() {
    const list = document.getElementById("beneficiaries-list");
    list.innerHTML = "";

    beneficiaries.forEach((beneficiary, index) => {
        const div = document.createElement("div");
        div.classList.add("beneficiary");
        div.innerHTML = `
            <span>${beneficiary.name}</span>
            <button class="delete-btn" onclick="deleteBeneficiary(${index})">❌</button>
        `;
        list.appendChild(div);
    });
}

function openBeneficiaryModal() {
    document.getElementById("beneficiary-modal").style.display = "block";
}

function closeBeneficiaryModal() {
    document.getElementById("beneficiary-modal").style.display = "none";
}

function addBeneficiary() {
    const name = document.getElementById("beneficiary-name").value.trim();
    if (name) {
        beneficiaries.push({ name: name, tags: [] });
        localStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));
        loadBeneficiaries();
        closeBeneficiaryModal();
    }
}

function deleteBeneficiary(index) {
    if (confirm("Voulez-vous vraiment supprimer ce bénéficiaire ?")) {
        beneficiaries.splice(index, 1);
        localStorage.setItem("beneficiaries", JSON.stringify(beneficiaries));
        loadBeneficiaries();
    }
}

function goBack() {
    window.location.href = "index.html";
}
