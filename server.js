const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

const PRODUCTS_DB_PATH = "products.json"; // File to store products

function saveProducts(products) {
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(products, null, 2), "utf-8");
}

function loadProducts() {
    try {
        const productsData = fs.readFileSync(PRODUCTS_DB_PATH, "utf-8");
        return JSON.parse(productsData);
    } catch (error) {
        return [];
    }
}

let products = loadProducts();

app.post("/addProduct", (req, res) => {
    const { productName, sellingPrice, category } = req.body;
    if (!productName || isNaN(sellingPrice)) {
        res.status(400).json({ message: "Invalid data." });
        return;
    }

    products.push({ productName, sellingPrice, category });
    saveProducts(products);
    res.json({ message: "Product added successfully." });
});

app.get("/getProducts", (req, res) => {
    res.json(products);
});

app.post("/deleteProduct", (req, res) => {
    const { index } = req.body;
    if (index >= 0 && index < products.length) {
        products.splice(index, 1);
        saveProducts(products);
        res.json({ message: "Product deleted successfully." });
    } else {
        res.status(400).json({ message: "Invalid index." });
    }
});

app.get("/viewProducts", (req, res) => {
    console.log("Products:", products);
    res.send("Products displayed in console.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
