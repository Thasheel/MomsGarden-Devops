
//$(function () {

//    $.ajax({
//        url: "https://localhost:7116/api/plants",
//        method: "GET",
//        success: function (data) {
//            loadPlants(data);
//        },
//        error: function (err) {
//            console.log("API Error:", err);
//        }
//    });

//});

fetch
//document.addEventListener("DOMContentLoaded", function () {

//    fetch("https://localhost:7116/api/plants")
//        .then(response => {
//            if (!response.ok) {
//                throw new Error("Network response was not ok");
//            }
//            return response.json();
//        })
//        .then(data => {
//            loadPlants(data);
//        })
//        .catch(error => {
//            console.log("API Error:", error);
//        });

//});
document.addEventListener("DOMContentLoaded", function () {

    const spinner = document.createElement("div");
    spinner.id = "spinner-overlay";
    spinner.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(spinner);

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

    fetch("https://localhost:7116/api/plants")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            loadPlants(data);
            spinner.remove(); 
        })
        .catch(error => {
            console.log("API Error:", error);
            spinner.remove(); 
        });

});


function loadPlants(plants) {

    const container = document.getElementById("plants");
    container.innerHTML = "";

    plants.forEach(p => {

        let stockText = p.stock > 0 ? "In Stock" : "Out of Stock";
        let stockClass = p.stock > 0 ? "in-stock" : "out-of-stock";
        let disabled = p.stock > 0 ? "" : "disabled";

        container.innerHTML += `
            <div class="plantitem">
                <img src="${p.imageUrl}" />
                <p class="plant-name">${p.name}</p>
                <p class="price">₹${p.price}</p>
                <p class="stock-status ${stockClass}">${stockText}</p>
                <button class="add-btn" data-id="${p.plantId}">
    Add to Cart
</button>
            </div>
        `;
    });
}



$(document).on("keyup", ".search-input", function () {

    let value = $(this).val().toLowerCase();

    $(".plantitem").each(function () {

        let name = $(this).find(".plant-name").text().toLowerCase();

        if (name.includes(value)) {
            $(this).show();
        } else {
            $(this).hide();
        }
            
    });
});


$(document).on("change", "#priceFilter, #stockFilter", function () {

    let priceValue = $("#priceFilter").val();
    let stockValue = $("#stockFilter").val();

    $(".plantitem").each(function () {

        let price = parseInt($(this).find(".price").text().replace("₹", ""));
        let stockText = $(this).find(".stock-status").text().trim();

        let priceMatch = false;
        let stockMatch = false;

        if (priceValue === "all") priceMatch = true;
        else if (priceValue === "low" && price < 300) priceMatch = true;
        else if (priceValue === "mid" && price >= 300 && price <= 500) priceMatch = true;
        else if (priceValue === "high" && price > 500) priceMatch = true;

        if (stockValue === "all") stockMatch = true;
        else if (stockValue === "in" && stockText === "In Stock") stockMatch = true;
        else if (stockValue === "out" && stockText === "Out of Stock") stockMatch = true;

        if (priceMatch && stockMatch) {
            $(this).fadeIn();
        } else {
            $(this).fadeOut();
        }

    });
});



$(document).on("click", "#clearFilter", function () {

    $("#priceFilter").val("all");
    $("#stockFilter").val("all");
    $(".plantitem").fadeIn();

});




//function showSuccessMessage() {

//    const $message = $("<div>")
//        .text("🌿 Added To Cart Successfully!")
//        .css({
//            position: "fixed",
//            top: "20px",
//            left: "50%",
//            transform: "translateX(-50%)",
//            background: "green",
//            color: "#fff",
//            padding: "15px 30px",
//            borderRadius: "8px",
//            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
//            zIndex: "9999",
//            display: "none",
//            fontSize: "16px"
//        });

//    $("body").append($message);

//    $message.fadeIn(400).delay(1500).fadeOut(400, function () {
//        $(this).remove();
//    });
//}

$(document).on("click", ".add-btn", async function () {

    const plantId = parseInt($(this).attr("data-id"));
    const userId = 1; // 🔥 change later to real logged-in user id

    if (!plantId) {
        console.error("Invalid plant ID");
        return;
    }

    try {
        const response = await fetch("https://localhost:7116/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                plantId: plantId,
                quantity: 1
            })
        });

        if (response.ok) {

            // nice green popup instead of alert
            const $message = $("<div>")
                .text("🌿 Added To Cart Successfully!")
                .css({
                    position: "fixed",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "green",
                    color: "#fff",
                    padding: "15px 30px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                    zIndex: "9999",
                    display: "none",
                    fontSize: "16px"
                });

            $("body").append($message);
            $message.fadeIn(400).delay(1500).fadeOut(400);

        } else {
            const errorText = await response.text();
            console.error("Server Error:", errorText);
        }

    } catch (error) {
        console.error("API Error:", error);
    }
});