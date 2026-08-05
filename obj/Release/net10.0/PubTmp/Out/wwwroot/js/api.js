document.addEventListener("DOMContentLoaded", function () {

    fetch("http://localhost:5134/api/plants")
        .then(res => res.json())
        .then(data => {
            loadPlants(data);
        })
        .catch(err => console.log(err));

    function loadPlants(plants) {

        const container = document.getElementById("plantContainer");
        container.innerHTML = "";

        plants.forEach(p => {

            let stockText = p.stock > 0 ? "In Stock" : "Out of Stock";
            let stockClass = p.stock > 0 ? "in-stock" : "out-of-stock";
            let disabled = p.stock > 0 ? "" : "disabled";

            container.innerHTML += `
                <div class="plantitem" >
                 <img src="http://localhost:5134/${p.imageUrl}" alt="${p.name}" />

                    <p class="plant-name">${p.name}</p>
                    <p class="price">₹${p.price}</p>
                    <p class="stock-status ${stockClass}">${stockText}</p>
                    <button class="add-btn" ${disabled}>Add to Cart</button>
                </div>
            `;
        });
    }

});
