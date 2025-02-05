// js/storeMain.js
const promisePool = require('../../../config/db');

async function getAllProducts() {
    try {
        const [rows] = await promisePool.query('SELECT * FROM PRODUCT');
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function getProductsByCategory(categoryId) {
    try {
        const [rows] = await promisePool.query('SELECT * FROM PRODUCT WHERE CATEGORY = ?', [categoryId]);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

module.exports = { getAllProducts, getProductsByCategory };


