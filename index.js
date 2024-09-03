const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// In-memory storage
let shops = [];
let shopItems = [];
let shopIdCounter = 1;
let itemIdCounter = 1;

// CRUD Operations for Shops

// Create a new shop
app.post('/shops', (req, res) => {
    const newShop = {
        id: shopIdCounter++,
        name: req.body.name,
    };
    shops.push(newShop);
    res.status(201).json(newShop);
});

// Get all shops
app.get('/shops', (req, res) => {
    res.json(shops);
});

// Get a single shop by ID
app.get('/shops/:id', (req, res) => {
    const shop = shops.find(shop => shop.id === parseInt(req.params.id));
    if (shop) {
        res.json(shop);
    } else {
        res.status(404).send('Shop not found');
    }
});

// Update a shop by ID
app.put('/shops/:id', (req, res) => {
    const shop = shops.find(shop => shop.id === parseInt(req.params.id));
    if (shop) {
        shop.name = req.body.name || shop.name;
        res.json(shop);
    } else {
        res.status(404).send('Shop not found');
    }
});

// Delete a shop by ID
app.delete('/shops/:id', (req, res) => {
    const shopIndex = shops.findIndex(shop => shop.id === parseInt(req.params.id));
    if (shopIndex !== -1) {
        shops.splice(shopIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Shop not found');
    }
});

// CRUD Operations for Shop Items

// Create a new item in a shop
app.post('/shops/:shopId/items', (req, res) => {
    const shop = shops.find(shop => shop.id === parseInt(req.params.shopId));
    if (!shop) {
        return res.status(404).send('Shop not found');
    }
    const newItem = {
        id: itemIdCounter++,
        name: req.body.name,
        price: req.body.price,
        shopId: shop.id,
    };
    shopItems.push(newItem);
    res.status(201).json(newItem);
});

// Get all items for a specific shop
app.get('/shops/:shopId/items', (req, res) => {
    const shop = shops.find(shop => shop.id === parseInt(req.params.shopId));
    if (!shop) {
        return res.status(404).send('Shop not found');
    }
    const items = shopItems.filter(item => item.shopId === shop.id);
    res.json(items);
});

// Get a specific item by ID from a shop
app.get('/shops/:shopId/items/:itemId', (req, res) => {
    const item = shopItems.find(item => item.id === parseInt(req.params.itemId) && item.shopId === parseInt(req.params.shopId));
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

// Update an item by ID in a shop
app.put('/shops/:shopId/items/:itemId', (req, res) => {
    const item = shopItems.find(item => item.id === parseInt(req.params.itemId) && item.shopId === parseInt(req.params.shopId));
    if (item) {
        item.name = req.body.name || item.name;
        item.price = req.body.price || item.price;
        res.json(item);
    } else {
        res.status(404).send('Item not found');
    }
});

// Delete an item by ID from a shop
app.delete('/shops/:shopId/items/:itemId', (req, res) => {
    const itemIndex = shopItems.findIndex(item => item.id === parseInt(req.params.itemId) && item.shopId === parseInt(req.params.shopId));
    if (itemIndex !== -1) {
        shopItems.splice(itemIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Item not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});