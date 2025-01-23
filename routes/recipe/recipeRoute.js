const express = require('express');
const router = express.Router();

router.get('/recipeList', (req, res) => {
    res.render('recipeList')
});

module.exports = router;