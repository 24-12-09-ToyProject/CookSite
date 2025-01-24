const pool = require('../../config/db');
const RecipeDTO = require('../../dtos/recipe/RecipeDTO');

async function getRecipeList(req, res) {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query
            ('SELECT MEMBER_ID, RECIPE_TITLE, RECIPE_THUMBNAIL FROM RECIPE');
        connection.release();

        // DTO로 변환
        const recipes = rows.map(row => new RecipeDTO(row));
        res.render('recipeList', { recipes });
    } catch (error) {
        console.error('레시피 목록 조회 오류:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { getRecipeList };
