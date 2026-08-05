//// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
//// for details on configuring this project to bundle and minify static web assets.

//// Write your JavaScript code.

//document.addEventListener("DOMContentLoaded", function () {
//    var cartItemsDiv = document.getElementById("cartItems");
//    var totalItemsSpan = document.getElementById("totalItems");
//    var totalPriceSpan = document.getElementById("totalPrice");

//    var cart = JSON.parse(localStorage.getItem("cart")) || [];


//    if (cart.length === 0) {
//        cartItemsDiv.innerHTML = "<p>Your cart is empty 🌱</p>";
//        totalItemsSpan.innerText = 0;
//        totalPriceSpan.innerText = 0;
//        return;
//    }
//    3
//    var totalPrice = 0;

//    cart.forEach(function (item, index) {
//        var itemDiv = document.createElement("div");
//        itemDiv.className = "cart-item";

//        itemDiv.innerHTML = `
//      <p><strong>${item.name}</strong></p>
//      <p>Price: ₹${item.price}</p>
//      <button onclick="removeItem(${index})">Remove</button>
//    `;

//        cartItemsDiv.appendChild(itemDiv);
//        totalPrice += item.price;
//    });

//    totalItemsSpan.innerText = cart.length;
//    totalPriceSpan.innerText = totalPrice;
//});


//function removeItem(index) {
//    var cart = JSON.parse(localStorage.getItem("cart")) || [];

//    cart.splice(index, 1);

//    localStorage.setItem("cart", JSON.stringify(cart));

//    location.reload();
//}

const userId = 1; // 🔥 change later

async function loadCart() {

    const response = await fetch("https://localhost:7116/api/cart");

    if (!response.ok) {
        console.error("Failed to load cart");
        return;
    }

    const items = await response.json();

    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    let totalPrice = 0;
    let totalItems = 0;

    items.forEach(item => {

        totalItems += item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <p>Plant ID: ${item.plantId}</p>
                <p>Quantity: ${item.quantity}</p>
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
    });

    document.getElementById("totalItems").innerText = totalItems;
}

async function removeItem(id) {

    await fetch(`https://localhost:7116/api/cart/${id}`, {
        method: "DELETE"
    });

    loadCart();
}

loadCart();