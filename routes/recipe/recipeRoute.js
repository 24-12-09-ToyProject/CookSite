const express = require('express');
const router = express.Router();
const { getRecipeList } = require('../../controllers/recipe/recipeController');

// 레시피 목록 화면을 출력하는 라우트
router.get('/list', getRecipeList);

module.exports = router;