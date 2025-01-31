const express = require('express');
const router = express.Router();
const { getRecipeList, getRecipeDetail } = require('../../controllers/recipe/recipeController');

// 레시피 목록 화면을 출력하는 라우트
router.get('/list', getRecipeList);

// 레시피 상세 화면을 출력하는 라우트
router.get('/detail/:recipeNo', getRecipeDetail);

// 레시피 등록 화면을 출력하는 라우트
router.get('/register', (req, res) => {
    res.render('recipeRegister');
});

module.exports = router;