const recipeService = require('../../services/recipe/recipeService');

// 레시피 리스트 정보 가져오는 함수
async function getRecipeList(req, res) {
    try {
        const { recipes, totalCount, template } = await recipeService.getRecipeList(req);

        // ajax 요청이면 JSON 응답, 아닐 경우 템플릿 렌더링
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.json({ recipes , totalCount });
        } else {
            res.render(template, { recipes, totalCount });
        }
    } catch (error) {
        console.error('레시피 목록 조회 오류:', error.message);
        res.status(500).send('레시피 목록 조회 중 오류가 발생했습니다.');
    }
}

// 레시피 상세 정보 가져오는 함수
async function getRecipeDetail(req, res) {
    try {
        const recipeNo = req.params.recipeNo; // URL 파라미터에서 recipeNo 가져오기
        const detail = await recipeService.getRecipeDetail(recipeNo);
        
        if(!detail) {
            return res.status(404).send('레시피를 찾을 수 없습니다.')
        }
        
        console.log('Recipe Detail:', detail);
        res.render('recipeDetail', { detail });
    } catch (error) {
        console.error('레시피 상세 조회 오류:', error.message);
        res.status(500).send('레시피 상세 정보를 가져오는 중 오류가 발생했습니다.');
    }
}

// 수정할 레시피 정보 가져오는 함수
async function getOneRecipeInfo(req, res) {
    try {
        const recipeNo = req.params.recipeNo;
        const recipe = await recipeService.getOneRecipeInfo(recipeNo);

        if (!recipe) {
            return res.status(404).json({ message: '레시피를 찾을 수 없습니다.' });
        }

        console.log(recipe);
        res.render('recipeUpdate', { recipe });
    } catch (error) {
        console.error('레시피 정보 가져오기 오류:', error.message);
        res.status(500).json({ message: '레시피 정보를 가져오는 중 오류가 발생했습니다.' });
    }
}

// 레시피 등록하는 함수
async function registerRecipe(req, res) {
    try {
        const result = await recipeService.registerRecipe(req);
        res.status(200).json(result);
    } catch (error) {
        // 트랜잭션 롤백
        console.error('레시피 등록 오류:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// 레시피 수정하는 함수
async function updateRecipe(req, res) {
    try {
        const result = await recipeService.updateRecipe(req);
        res.json(result);
    } catch (error) {
        console.error('레시피 업데이트 오류:', error.message);
        res.status(500).json({ message: '레시피 업데이트 중 오류가 발생했습니다.' });
    }
}

// 레시피 삭제하는 함수
async function deleteRecipe(req, res) {
    try {
        const result = await recipeService.deleteRecipe(req);
        res.status(200).json(result);
    } catch (error) {
        console.error('레시피 삭제 오류:', error.message);
        res.status(500).json({message: '레시피 삭제 중 오류가 발생했습니다.'});
    } finally {
        if(connection) connection.release();
    }
}

module.exports = { 
    getRecipeList, 
    getRecipeDetail, 
    getOneRecipeInfo, 
    registerRecipe, 
    updateRecipe, 
    deleteRecipe 
};