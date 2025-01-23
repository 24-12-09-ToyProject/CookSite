const express = require('express');
const router = express.Router();

// 레시피 리스트 페이지 출력
router.get('/list', (req, res) => {
    res.render('recipeList')
});

module.exports = router;