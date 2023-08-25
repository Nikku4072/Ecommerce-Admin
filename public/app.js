document.addEventListener("DOMContentLoaded", function() {
    const addProductButton = document.getElementById("addProductButton");
    const productNameInput = document.getElementById("productName");
    const sellingPriceInput = document.getElementById("sellingPrice");
    const categorySelect = document.getElementById("category");
    const messageDiv = document.getElementById("message");
    const productList = document.getElementById("productList");

    addProductButton.addEventListener("click", function() {
        const productName = productNameInput.value;
        const sellingPrice = parseFloat(sellingPriceInput.value);
        const category = categorySelect.value;

        if (!productName || isNaN(sellingPrice)) {
            messageDiv.innerText = "Please fill in all fields.";
            return;
        }

        fetch("/addProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productName, sellingPrice, category })
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.innerText = data.message;
            productNameInput.value = "";
            sellingPriceInput.value = "";
            fetchProducts();
        })
        .catch(error => {
            console.error("Error:", error);
            messageDiv.innerText = "An error occurred while adding the product.";
        });
    });

    function fetchProducts() {
        fetch("/getProducts")
            .then(response => response.json())
            .then(products => {
                displayProductList(products);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    function displayProductList(products) {
        productList.innerHTML = "";

        products.forEach((product, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${product.productName} - $${product.sellingPrice} - ${product.category}</span>
                <button class="deleteButton" data-index="${index}">Delete</button>
            `;
            productList.appendChild(listItem);
        });

        const deleteButtons = document.querySelectorAll(".deleteButton");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function() {
                const index = this.getAttribute("data-index");
                deleteProduct(index);
            });
        });
    }

    function deleteProduct(index) {
        fetch("/deleteProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ index })
        })
        .then(response => response.json())
        .then(data => {
            fetchProducts();
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }

    fetchProducts();
});
