const axios = require('axios');
const cheerio = require('cheerio');
const pool = require('../config/db');

const listUrl = "https://www.10000recipe.com/recipe/list.html?cat4=53&order=reco&page=2";

// 레시피 목록 페이지에서 데이터 추출
async function getListData() {
    try {
        // 레시피 목록 페이지 가져오기
        const { data } = await axios.get(listUrl);
        const $ = cheerio.load(data);
        const items = [];
        // URL 중복 체크를 위한 Set
        const processedUrls = new Set();

        // 레시피 목록의 각 아이템 선택
        const listItems = $('.common_sp_list_li');
        console.log(`Found ${listItems.length} items to process`);

        // 각 레시피 아이템 처리
        for (let i = 0; i < listItems.length; i++) {
            const element = listItems[i];
            const detailUrl = $(element).find('.common_sp_thumb a').attr('href');
            
            // URL이 없는 경우 스킵
            if (!detailUrl) continue;
            
            // 상세 페이지 전체 URL 생성
            const fullDetailUrl = detailUrl.startsWith('http') ? detailUrl : `https://www.10000recipe.com${detailUrl}`;
            
            // 중복 URL 체크
            if (processedUrls.has(fullDetailUrl)) {
                console.log(`Skipping duplicate URL: ${fullDetailUrl}`);
                continue;
            }
            processedUrls.add(fullDetailUrl);

            // 레시피 기본 정보 추출
            const title = $(element).find('.common_sp_caption .common_sp_caption_tit.line2').text().trim();
            const thumbnail = $(element).find('.common_sp_thumb a > img').attr('src');
            const thumbnailUrl = thumbnail?.startsWith('http') ? thumbnail : `https:${thumbnail}`;

            try {
                console.log(`Processing item ${i + 1}/${listItems.length}: ${title}`);
                // 상세 페이지 데이터 가져오기
                const detailData = await getDetailData(fullDetailUrl);
                
                if (detailData && detailData.steps.length > 0) {
                    // 레시피 테이블에 저장
                    const recipeNo = await saveRecipe({
                        title,
                        intro: detailData.intro,
                        category: detailData.category,
                        difficulty: detailData.difficulty,
                        serving: detailData.serving,
                        ingredients: detailData.ingredients,
                        thumbnail: thumbnailUrl
                    });

                    // 각 조리 단계 저장
                    await saveSteps(recipeNo, detailData.steps);
                    
                    items.push({
                        title,
                        thumbnail: thumbnailUrl,
                        detailUrl: fullDetailUrl,
                        detailData
                    });
                    
                } else {
                    console.log(`Skipping ${title} because steps data is empty.`);
                }
            } catch (error) {
                console.error(`Error processing item ${title}:`, error.message);
                continue;
            }

            // 웹사이트 부하 방지를 위한 지연
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return items;
    } catch(error) {
        console.error('데이터 추출 과정에서 오류 발생', error);
        throw error;
    }
}


// 레시피 데이터를 DB에 저장
async function saveRecipe({ title, intro, category, difficulty, serving, ingredients, thumbnail }) {
    try {
        const connection = await pool.getConnection();
        
        // ingredients가 배열이 아닌 경우 빈 배열로 처리
        const ingredientsString = Array.isArray(ingredients) ? ingredients.join(', ') : '';

        const query = `
            INSERT INTO recipe 
            (RECIPE_TITLE, RECIPE_INTRO, RECIPE_CATEGORY, RECIPE_DIFFICULTY, SERVING, INGREDIENTS, RECIPE_THUMBNAIL, CREATED_AT, UPDATED_AT) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        const [result] = await connection.execute(query, [title, intro, category, difficulty, serving, ingredientsString, thumbnail]);
        connection.release();
        return result.insertId;  // 새로 생성된 RECIPE_NO 반환
    } catch (error) {
        console.error('레시피 저장 중 오류 발생:', error.message);
        throw error;
    }
}

// 조리 단계를 DB에 저장
async function saveSteps(recipeNo, steps) {
    try {
        const connection = await pool.getConnection();
        const stepPromises = steps.map(async (step) => {
            const { description, imgUrl } = step;
            const query = `
                INSERT INTO steps 
                (RECIPE_NO, STEP, DESCRIPTION, RECIPE_IMAGE_PATH) 
                VALUES (?, ?, ?, ?)`;
            await connection.execute(query, [recipeNo, step.step, description, imgUrl]);
        });
        await Promise.all(stepPromises);
        connection.release();
    } catch (error) {
        console.error('조리 단계 저장 중 오류 발생:', error.message);
        throw error;
    }
}

// 상세 정보 페이지에서 데이터 추출
async function getDetailData(detailUrl) {
    try {
        const { data } = await axios.get(detailUrl);
        const $ = cheerio.load(data);

        // 중복 제거를 위한 Set과 Map 사용
        const ingredients = new Set();
        const steps = new Map();
        // 기본 정보 추출
        const intro = $('#recipeIntro').text().replace(/\n/g, ' ').trim();
        const difficulty = $('.view2_summary_info3').text().trim();
        const serving = $('.view2_summary_info1').text().trim();
        const category = '면/만두';

        // 재료 정보 추출
        $('#divConfirmedMaterialArea li').each((index, element) => {
            const nameElement = $(element).find(".ingre_list_name a");
            // span 태그 제거 후 텍스트 추출
            const name = nameElement.clone().children('span').remove().end().text().trim();
            const quantity = $(element).find('.ingre_list_ea').text().trim();
            if (name && quantity) {
                ingredients.add(`${name} ${quantity}`);
            }
        });

        // 조리 단계 추출
        $('.view_step_cont').each((index, element) => {
            const descElement = $(element).find(".media-body");
            // p 태그 제거 후 텍스트 추출
            const description = descElement.clone().children('p').remove().end().text().trim();
            const imgUrl = $(element).find('img').attr('src');
            if (description && imgUrl) {
                // 중복 단계 체크를 위한 키 생성
                const stepKey = `${description}-${imgUrl}`;
                if (!steps.has(stepKey)) {
                    steps.set(stepKey, {
                        step: steps.size + 1,
                        description,
                        imgUrl
                    });
                }
            }
        });

        // 수집된 데이터 반환
        return {
            intro,       // 레시피 소개
            difficulty,  // 난이도
            category,    // 카테고리
            serving,     // 인분
            ingredients: Array.from(ingredients),  // 재료 목록
            steps: Array.from(steps.values())      // 조리 단계
        };
    } catch (error) {
        console.error(`상세 데이터 추출 오류 (${detailUrl}):`, error.message);
        return null;
    }
}

(async () => {
    try {
        await getListData();
    } catch (error) {
        console.error('크롤링 실행 중 오류 발생:', error);
    }
})();
