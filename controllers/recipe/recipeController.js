const pool = require('../../config/db');
const RecipeDTO = require('../../dtos/recipe/RecipeDTO');

// 레시피 리스트 정보 가져오는 함수
async function getRecipeList(req, res) {
    try {
        const connection = await pool.getConnection();

        // 카테고리 파라미터 가져오기
        const category = req.query.category;
        let kCategory;

        switch (category) {
            case 'all': kCategory = null; break;
            case 'sidedish': kCategory = '밑반찬'; break;
            case 'maindish': kCategory = '메인반찬'; break;
            case 'soup': kCategory = '국/탕/찌개'; break;
            case 'noodle': kCategory = '면/만두'; break;
            case 'rice': kCategory = '밥/죽/떡'; break;
            case 'western': kCategory = '양식/샐러드'; break;
            default: kCategory = null;
        }

        let query = 'SELECT RECIPE_NO, MEMBER_ID, RECIPE_TITLE, RECIPE_THUMBNAIL FROM RECIPE';
        if(kCategory) {
            query += ' WHERE RECIPE_CATEGORY = ?';
        }

        const [rows] = await connection.query(query, kCategory ? [kCategory] : []);
        connection.release();

        const recipes = rows.map(row => new RecipeDTO(row));

        // ajax 요청이면 json 객체 반환, 아닐 경우 recipeList 페이지 렌더링
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.json({ recipes });
        } else {
            res.render('recipeList', { recipes });
        }
    } catch (error) {
        console.error('레시피 목록 조회 오류:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// 레시피 상세 정보 가져오는 함수
// async function getRecipeDetail(req, res) {

// }

module.exports = { getRecipeList };
