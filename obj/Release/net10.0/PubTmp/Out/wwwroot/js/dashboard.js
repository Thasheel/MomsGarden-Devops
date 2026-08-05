

function openAddModal() {
    document.getElementById("addModal").style.display = "flex";
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

function openEditModal(id, name, price, stock, imageUrl) {
    document.getElementById("editId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editPrice").value = price;
    document.getElementById("editStock").value = stock;
    document.getElementById("editImageUrl").value = imageUrl;

    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}




function showSpinner() {

    if (document.getElementById("spinner-overlay")) return;

    const spinner = document.createElement("div");
    spinner.id = "spinner-overlay";
    spinner.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(spinner);
}


(function () {
    const style = document.createElement("style");
    style.innerHTML = `
        #spinner-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 6px solid #ddd;
            border-top: 6px solid #22c55e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
})();




document.addEventListener("DOMContentLoaded", function () {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function () {

            showSpinner();

            const buttons = form.querySelectorAll("button");
            buttons.forEach(btn => btn.disabled = true);
        });
    });

});