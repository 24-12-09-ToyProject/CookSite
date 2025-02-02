const pool = require('../../config/db');
const RecipeDTO = require('../../dtos/recipe/RecipeDTO');
const RecipeDetailDTO = require('../../dtos/recipe/RecipeDetailDTO');

// 레시피 리스트 정보 가져오는 함수
async function getRecipeList(req, res) {
    try {
        const connection = await pool.getConnection();

        // 경로를 기준으로 MEMBER_ID 설정
        const isMyList = req.originalUrl.includes('/myList');
        const memberId = isMyList ? req.session.user.id : null;

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
        const queryParams = [];

        if(memberId) {
            query += ' WHERE MEMBER_ID = ?';
            countQuery += ' WHERE MEMBER_ID = ?';
            queryParams.push(memberId);
        }

        if (kCategory) {
            query += memberId ? ' AND RECIPE_CATEGORY = ?' : ' WHERE RECIPE_CATEGORY = ?';
            countQuery += memberId ? ' AND RECIPE_CATEGORY = ?' : ' WHERE RECIPE_CATEGORY = ?';
            queryParams.push(kCategory);
        }

        query += ' ORDER BY RECIPE_NO DESC LIMIT ? OFFSET ?';
        queryParams.push(boardLimit, offset);

        const [rows] = await connection.query(query, queryParams);
        const [countRows] = await connection.query(countQuery, memberId ? [memberId, ...(kCategory ? [kCategory] : [])] : kCategory ? [kCategory] : []);
        connection.release();

        const recipes = rows.map(row => new RecipeDTO(row));
        const totalCount = countRows[0].totalCount;

        // ajax 요청이면 json 객체 반환, 아닐 경우 페이지 렌더링
        const template = isMyList ? 'myRecipeList' : 'recipeList';
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.json({ recipes , totalCount });
        } else {
            res.render(template, { recipes, totalCount });
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
async function registerRecipe(req, res) {
    let connection;
    try {
        // MySQL 연결 및 트랜잭션 시작
        connection = await pool.getConnection();
        await connection.beginTransaction();

        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);
        console.log(req.session.user.id);

        const member_id = req.session.user.id;

        // 레시피 데이터 삽입
        const { title, intro, category, serving, difficulty, ingredients, description } = req.body;

        // 필수 값 처리
        if (!title || !intro || !category || !serving || !difficulty || !ingredients || !description || description.length === 0) {
            return res.status(400).json({ message: "모든 필수 항목을 입력해주세요." });
        }

        // 썸네일 처리 (단일 이미지)
        const thumbnail = req.files['thumbnail'] && req.files['thumbnail'][0] ? req.files['thumbnail'][0].filename : null;
        if (!thumbnail) {
            return res.status(400).json({ message: "썸네일 이미지를 업로드해주세요." });
        }
        const thumbnailUrl = `http://127.0.0.1:8888/uploads/${thumbnail}`;

        // 레시피 SQL 작성
        const recipeSql = `
            INSERT INTO RECIPE 
            (MEMBER_ID, RECIPE_TITLE, RECIPE_INTRO, RECIPE_CATEGORY, RECIPE_DIFFICULTY, 
            SERVING, INGREDIENTS, RECIPE_THUMBNAIL, CREATED_AT, UPDATED_AT)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        
        const recipeValues = [member_id, title, intro, category, difficulty, serving, ingredients, thumbnailUrl];
        const [recipeResult] = await connection.query(recipeSql, recipeValues);
        const recipeId = recipeResult.insertId;

        // 조리 순서 데이터 배열 변환 (단일 값일 경우 대비)
        const descriptions = Array.isArray(description) ? description : [description];
        const recipe_image_paths = req.files['recipe_image_path[]'] || [];

        // 조리 순서 배열 및 이미지 확인
        if (descriptions.length === 0 || descriptions.some(desc => !desc.trim()) || recipe_image_paths.length < descriptions.length) {
            return res.status(400).json({ message: "조리 순서와 이미지를 모두 입력해주세요." });
        }

        // 스텝 데이터 삽입
        const stepSql = `
            INSERT INTO STEPS
            (RECIPE_NO, STEP, DESCRIPTION, RECIPE_IMAGE_PATH)
            VALUES (?, ?, ?, ?)
        `;

        const stepPromises = descriptions.map((desc, index) => {
            const stepImagePath = recipe_image_paths[index].filename;
            const stepImageUrl = `http://127.0.0.1:8888/uploads/${stepImagePath}`;

            const stepValues = [
                recipeId, 
                index + 1, 
                desc, 
                stepImageUrl
            ];
            return connection.query(stepSql, stepValues);
        });

        await Promise.all(stepPromises);

        // 트랜잭션 커밋
        await connection.commit();
        res.status(200).json({
            message: '레시피가 성공적으로 등록되었습니다.'
        });
    } catch (error) {
        // 트랜잭션 롤백
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('트랜잭션 롤백 오류:', rollbackError.message);
            }
        }
        console.error('레시피 등록 오류:', error.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


module.exports = { getRecipeList, getRecipeDetail, registerRecipe };
