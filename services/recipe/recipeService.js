const pool = require('../../config/db');
const RecipeDTO = require('../../dtos/recipe/RecipeDTO');
const RecipeDetailDTO = require('../../dtos/recipe/RecipeDetailDTO')

async function getRecipeList(req) {
    const connection = await pool.getConnection();

    try {
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

        let query = `
            SELECT 
                r.RECIPE_NO,
                r.MEMBER_ID, 
                r.RECIPE_TITLE, 
                r.RECIPE_THUMBNAIL, 
                p.FILE_RENAME
            FROM 
                RECIPE r
            LEFT JOIN 
                PROFILE_IMGS p ON r.MEMBER_ID = p.MEMBER_ID
        `;
        let countQuery = 'SELECT COUNT(*) AS totalCount FROM RECIPE';
        const queryParams = [];

        if(memberId) {
            query += ' WHERE r.MEMBER_ID = ?';
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
        const [countRows] = await connection.query(countQuery, 
            memberId 
                ? (kCategory ? [memberId, kCategory] : [memberId]) 
                : (kCategory ? [kCategory] : []));
        connection.release();

        const recipes = rows.map(row => { return new RecipeDTO(row); });
        const totalCount = countRows[0].totalCount;

        return { recipes, totalCount, template: isMyList ? 'myRecipeList' : 'recipeList' };
    } catch (error) {
        console.error('레시피 목록 조회 오류:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function getRecipeDetail(recipeNo) {
    const connection = await pool.getConnection();

    try {
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
        if(rows.length === 0) { 
            return null; 
        }
        const detail = new RecipeDetailDTO(rows[0]);
        
        // 조리순서 추가
        rows.forEach(row => detail.addStep(row));

        return detail;

    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function getOneRecipeInfo(recipeNo) {
    let connection;
    try {
        connection = await pool.getConnection();

        // 레시피 정보 가져오기
        const recipeQuery = 'SELECT * FROM RECIPE WHERE RECIPE_NO = ?';
        const [recipeRows] = await connection.query(recipeQuery, [recipeNo]);
        if (recipeRows.length === 0) {
            return null;
        }
        const recipe = new RecipeDetailDTO(recipeRows[0]);

        // 조리 순서 정보 가져오기
        const stepsQuery = 'SELECT * FROM STEPS WHERE RECIPE_NO = ? ORDER BY STEP';
        const [stepsRows] = await connection.query(stepsQuery, [recipeNo]);

        stepsRows.forEach(step => recipe.addStep(step));

        return recipe;
    } catch (error) {
        throw error;
    } finally {
        connection.release();
    }
}

async function registerRecipe(req) {
    let connection;
    try {
        // db 연결 및 트랜잭션 시작
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const memberId = req.session.user.id;
        const { title, intro, category, serving, difficulty, ingredients, description } = req.body;

        // 필수 값 처리
        if (!title || !intro || !category || !serving || !difficulty || !ingredients || !description || description.length === 0) {
            throw new Error("모든 필수 항목을 입력해주세요.");
        }

        // 썸네일 처리 (단일 이미지)
        const thumbnail = req.files['thumbnail'] && req.files['thumbnail'][0] ? req.files['thumbnail'][0].filename : null;
        if (!thumbnail) {
            throw new Error("썸네일 이미지를 업로드해주세요.");
        }
        const thumbnailUrl = `http://127.0.0.1:8888/uploads/${thumbnail}`;

        // recipe 데이터 삽입
        const recipeSql = `
            INSERT INTO RECIPE 
            (MEMBER_ID, RECIPE_TITLE, RECIPE_INTRO, RECIPE_CATEGORY, RECIPE_DIFFICULTY, 
            SERVING, INGREDIENTS, RECIPE_THUMBNAIL, CREATED_AT, UPDATED_AT)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;
        const recipeValues = [memberId, title, intro, category, difficulty, serving, ingredients, thumbnailUrl];
        const [recipeResult] = await connection.query(recipeSql, recipeValues);
        const recipeId = recipeResult.insertId;

        // 조리 순서 데이터 배열 변환 (단일 값일 경우 대비)
        const descriptions = Array.isArray(description) ? description : [description];
        const recipe_image_paths = req.files['recipe_image_path[]'] || [];

        // 조리 순서 및 이미지 유효성 검사
        const validDescriptions = descriptions.filter(desc => desc.trim());
        if (validDescriptions.length === 0 || recipe_image_paths.length < validDescriptions.length) {
            throw new Error("조리 순서와 이미지를 모두 입력해주세요.");
        }

        // 빈 step이 있는지 확인
        for (let i = 0; i < validDescriptions.length; i++) {
            if (!validDescriptions[i].trim() || !recipe_image_paths[i]) {
                throw new Error("조리 순서와 이미지를 모두 입력해주세요.");
            }
        }

        // step 데이터 삽입
        const stepSql = `
            INSERT INTO STEPS
            (RECIPE_NO, STEP, DESCRIPTION, RECIPE_IMAGE_PATH)
            VALUES (?, ?, ?, ?)
        `;

        const stepPromises = validDescriptions.map((desc, index) => {
            const stepImagePath = recipe_image_paths[index].filename;
            const stepImageUrl = `http://127.0.0.1:8888/uploads/${stepImagePath}`;
            const stepValues = [ recipeId, index + 1, desc, stepImageUrl ];
            return connection.query(stepSql, stepValues);
        });
        await Promise.all(stepPromises);

        // 트랜잭션 커밋
        await connection.commit();
        
        return { message: '레시피가 성공적으로 등록되었습니다.' };
    } catch (error) {
        if ( connection ) await connection.rollback();
    } finally {
        if (connection) connection.release();
    }
}

async function updateRecipe(req) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const memberId = req.session.user.id;
        const recipeNo = req.params.recipeNo;
        const { title, intro, category, serving, difficulty, ingredients, description } = req.body;

        // 필수 항목 검증
        if (!title || !intro || !category || !serving || !difficulty || !ingredients || !description || description.length === 0) {
            return res.status(400).json({ message: "모든 필수 항목을 입력해주세요." });
        }

        // 썸네일 처리
        const thumbnail = req.files['thumbnail'] && req.files['thumbnail'][0] ? req.files['thumbnail'][0].filename : null;
        const existingThumbnail = Array.isArray(req.body.existingThumbnail) ? req.body.existingThumbnail[0] : req.body.existingThumbnail;
        const thumbnailUrl = thumbnail ? `http://127.0.0.1:8888/uploads/${thumbnail}` : existingThumbnail;

        // recipe 정보 업데이트
        const updateRecipeQuery = `
            UPDATE RECIPE 
            SET RECIPE_TITLE = ?, RECIPE_INTRO = ?, RECIPE_CATEGORY = ?, 
                RECIPE_DIFFICULTY = ?, SERVING = ?, INGREDIENTS = ?, 
                RECIPE_THUMBNAIL = ? 
            WHERE RECIPE_NO = ? AND MEMBER_ID = ?`;
        const [recipeUpdateResult] = await connection.query(updateRecipeQuery, [title, intro, category, difficulty, serving, ingredients, thumbnailUrl, recipeNo, memberId]);

        // recipe 업데이트 결과가 없으면 오류 처리
        if (recipeUpdateResult.affectedRows === 0) {
            throw new Error('레시피 정보 업데이트 실패');
        }

        // description과 image 처리
        const descriptions = Array.isArray(description) ? description : [description];
        const recipe_image_paths = req.files['recipe_image_path[]'] || [];
        const stepNumber = req.body['step_number[]'] || req.body.step_number;
        const stepNumbers = Array.isArray(stepNumber) ? stepNumber : [stepNumber];

        console.log("req.body:", req.body);
        console.log("req.files:", req.files);

        // 조리 순서 설명 유효성 체크
        const validDescriptions = descriptions.filter(desc => desc.trim());

        // 이미지 URL 생성 (새로운 이미지, 기존 이미지)
        const stepImageUrls = descriptions.map((desc, i) => {
            const stepIndex = stepNumbers.indexOf((i + 1).toString());
            if (stepIndex !== -1 && recipe_image_paths.length > stepIndex) {
                // 새 이미지 사용
                console.log(`새 이미지 사용 [${i}]:`, recipe_image_paths[stepIndex].filename);
                return `http://127.0.0.1:8888/uploads/${recipe_image_paths[stepIndex].filename}`;
            } else {
                // 기존 이미지 유지
                const existingImage = req.body[`existingImage${i + 1}`] || null;
                console.log(`기존 이미지 유지 [${i}]:`, existingImage);
                return existingImage;
            }
        });
        console.log("최종 조리 순서 이미지 URL 목록:", stepImageUrls);

        // 설명과 이미지가 일치하는지 검증
        if (validDescriptions.length != stepImageUrls.length || stepImageUrls.includes(null)) {
            throw new Error("조리 순서와 이미지를 모두 입력해주세요.");
        }

        // 기존 step 삭제
        const deleteStepsQuery = 'DELETE FROM STEPS WHERE RECIPE_NO = ?';
        const [deleteResult] = await connection.query(deleteStepsQuery, [recipeNo]);
        if (deleteResult.affectedRows === 0) {
            throw new Error("조리 순서 삭제 실패");
        }

        // 새 step 데이터 삽입
        const insertStepQuery = `INSERT INTO STEPS (RECIPE_NO, STEP, DESCRIPTION, RECIPE_IMAGE_PATH) VALUES (?, ?, ?, ?)`;
        for (let i = 0; i < validDescriptions.length; i++) {
            const [insertResult] = await connection.query(insertStepQuery, [recipeNo, i + 1, validDescriptions[i], stepImageUrls[i]]);
            if (insertResult.affectedRows === 0) {
                throw new Error(`Step ${i + 1} 삽입 실패`);
            }
        }

        await connection.commit();
        return { message: '레시피가 성공적으로 업데이트되었습니다.' };
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function deleteRecipe(req) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const recipeNo = req.params.recipeNo;
        const memberId = req.session.user.id;

        const query = 'DELETE FROM RECIPE WHERE RECIPE_NO = ? AND MEMBER_ID = ?';
        const [result] = await connection.query(query, [recipeNo, memberId]);

        if (result.affectedRows === 0) {
            throw new Error('레시피를 찾을 수 없거나 권한이 없습니다.');
        }

        await connection.commit();
        return { message: '레시피 삭제가 완료되었습니다.' };
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
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