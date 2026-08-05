

//var msg = document.createElement("div");
//msg.style.cssText =
//    "position:fixed;top:20px;left:50%;transform:translateX(-50%);" +
//    "background:#2e7d32;color:#fff;padding:10px 18px;" +
//    "border-radius:6px;opacity:0;transition:.4s;z-index:1000;";
//document.body.appendChild(msg);

//var timer;



//var cartCount = document.getElementById("cart-count");

//function updateCartCount() {
//    var cart = JSON.parse(localStorage.getItem("cart")) || [];
//    if (cartCount) {
//        cartCount.innerText = cart.length;
//    }
//}

//updateCartCount();



//const popup = document.createElement("div");
//popup.innerText = "🌿 Special Offer! Get 20% OFF on all plants 🌸";

//popup.style.cssText =
//    "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.5);" +
//    "background:black;color:#fff;padding:25px 40px;font-size:20px;" +
//    "border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.3);" +
//    "z-index:9999;opacity:0;transition:all .4s ease;";

//document.body.appendChild(popup);

//setTimeout(() => {
//    popup.style.opacity = "1";
//    popup.style.transform = "translate(-50%,-50%) scale(1)";
//}, 500);

//setTimeout(() => {
//    popup.style.opacity = "0";
//    popup.style.transform = "translate(-50%,-50%) scale(0.5)";
//}, 2500);



const texts = [
    "🌿 Fresh Plants",
    "🌱 Locally Grown",
    "♻️ Eco-Friendly",
    "🚚 Home Delivery"
];

let index = 0;

const textBox = document.createElement("div");
textBox.innerText = texts[index];

textBox.style.cssText =
    "position:absolute;top:150px;left:50%;transform:translateX(-50%);" +
    "font-size:22px;font-weight:600;color:black;" +
    "z-index:999;transition:opacity .4s ease;";

document.body.appendChild(textBox);

setInterval(() => {
    textBox.style.opacity = "0";
    setTimeout(() => {
        index = (index + 1) % texts.length;
        textBox.innerText = texts[index];
        textBox.style.opacity = "1";
    }, 400);
}, 2000);




$(function () {

    $.ajax({
        url: "https://localhost:7116/api/plants",
        method: "GET",
        success: function (data) {
            loadPlants(data);
        },
        error: function (err) {
            console.log("API Error:", err);
        }
    });

});




function loadPlants(plants) {

    const container = document.getElementById("plantContainer");
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
</button    
    </div>
`;
    });

  
}

//jquery

$(function () {

    const $popup = $("<div>")
        .text("🌿 Special Offer! Get 20% OFF on all plants 🌸")
        .css({
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "black",
            color: "#fff",
            padding: "25px 40px",
            fontSize: "20px",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            zIndex: "9999",
            display: "none"
        });

    $("body").append($popup);

    $popup.fadeIn(500).delay(2000).fadeOut(500);

});


$(document).on("click", ".add-btn", function () {

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

    $message.fadeIn(400).delay(1500).fadeOut(400
    );

});



$(document).on("click", ".add-btn", async function () {

    const plantId = parseInt($(this).attr("data-id"));
    const userId = 1; 

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