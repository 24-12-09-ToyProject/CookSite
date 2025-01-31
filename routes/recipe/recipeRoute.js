const express = require('express');
const router = express.Router();
const upload = require('../../config/upload')
const { getRecipeList, getRecipeDetail, registerRecipe } = require('../../controllers/recipe/recipeController');
const { checkLogin } = require('../member/checkLogin');

// 레시피 목록 화면을 출력하는 라우트
router.get('/list', getRecipeList);

// 레시피 상세 화면을 출력하는 라우트
router.get('/detail/:recipeNo', getRecipeDetail);

// 레시피 등록 화면을 출력하는 라우트
router.get('/register', checkLogin, (req, res) => {
    res.render('recipeRegister');
});

// 레시피 등록하는 라우트  (multer 미들웨어 추가)
router.post('/register', checkLogin, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'recipe_image_path[]', maxCount: 10 }
]), registerRecipe);

module.exports = router;