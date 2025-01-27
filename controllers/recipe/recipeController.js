const pool = require('../../config/db');
const RecipeDTO = require('../../dtos/recipe/RecipeDTO');
const RecipeDetailDTO = require('../../dtos/recipe/RecipeDetailDTO');

// 레시피 리스트 정보 가져오는 함수
async function getRecipeList(req, res) {
    try {
        const connection = await pool.getConnection();

        // 카테고리 파라미터 가져오기
        const category = req.query.category;
        const page = parseInt(req.query.page, 10) || 1;
        const boardLimit = 20;
        const offset = (page - 1) * boardLimit;
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
        let countQuery = 'SELECT COUNT(*) AS totalCount FROM RECIPE';
        if(kCategory) {
            query += ' WHERE RECIPE_CATEGORY = ?';
            countQuery += ' WHERE RECIPE_CATEGORY = ?';
        }
        query += ' ORDER BY RECIPE_NO DESC LIMIT ? OFFSET ?';

        const [rows] = await connection.query(query, kCategory ? [kCategory, boardLimit, offset] : [boardLimit, offset]);
        const [countRows] = await connection.query(countQuery, kCategory ? [kCategory] : []);
        connection.release();

        const recipes = rows.map(row => new RecipeDTO(row));
        const totalCount = countRows[0].totalCount;

        // ajax 요청이면 json 객체 반환, 아닐 경우 recipeList 페이지 렌더링
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.json({ recipes , totalCount });
        } else {
            res.render('recipeList', { recipes , totalCount });
        }
    } catch (error) {
        console.error('레시피 목록 조회 오류:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// 레시피 상세 정보 가져오는 함수
async function getRecipeDetail(req, res) {
    try {
        const connection = await pool.getConnection();
        const recipeNo = req.params.recipeNo; // URL 파라미터에서 recipeNo 가져오기
        
        const query = `
            SELECT 
                r.RECIPE_NO,
                r.MEMBER_ID,
                r.RECIPE_TITLE,
                r.RECIPE_INTRO,
                r.RECIPE_CATEGORY,
                r.RECIPE_DIFFICULTY,
                r.SERVING,
                r.INGREDIENTS,
                r.RECIPE_THUMBNAIL,
                s.STEP_NO,
                s.STEP,
                s.DESCRIPTION,
                s.RECIPE_IMAGE_PATH
            FROM 
                RECIPE r
            LEFT JOIN 
                STEPS s ON r.RECIPE_NO = s.RECIPE_NO
            WHERE 
                r.RECIPE_NO = ?;
        `;
        const [rows] = await connection.query(query, [recipeNo]);
        connection.release();

        if(rows.length === 0) {
            return res.status(404).send('레시피를 찾을 수 없습니다.')
        }

        const detail = new RecipeDetailDTO(rows[0]);

        // 모든 조리 단계 추가
        rows.forEach(row => {
            detail.addStep(row);
        })
        console.log('Recipe Detail:', detail);

        res.render('recipeDetail', { detail });
    } catch (error) {
        console.error('레시피 상세 조회 오류:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

// 레시피 등록하는 함수

module.exports = { getRecipeList, getRecipeDetail };
