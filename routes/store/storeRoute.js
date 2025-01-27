const express = require('express');
const router = express.Router();
const { getTables } = require('../../static/js/store/storeMain')  // storeMain.js에서 getTables 함수 가져오기
const { getProductDetails } = require('../../static/js/store/storeDetail');  // 경로 확인

// '/storeMain' 경로에 대해 비동기 라우팅 처리
router.get("/storeMain", async (req, res) => {
    try {
        // 테이블 조회 함수 호출
        const tables = await getTables();
        // 테이블 목록을 클라이언트로 전달하여 렌더링
        res.render('store/storeMain.html', { tables });  // storeMain.html에 데이터 전달
    } catch (error) {
        console.error('에러 발생:', error);
        res.status(500).send('데이터베이스 조회 중 오류가 발생했습니다.');
    }
});

router.get('/product/:id', async (req, res) => {
    const productId = req.params.id; // URL에서 상품 ID 가져오기

    try {
        const details = await getProductDetails(productId); // 상품 상세 정보 조회
        res.render('store/storeDetail.html', { details }); // productDetail.ejs에 데이터 전달
    } catch (err) {
        console.error(err);
        res.status(500).send('상품 정보를 불러오는데 실패했습니다.');
    }
});
module.exports = router;