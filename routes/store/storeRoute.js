const express = require('express');
const router = express.Router();
const { getTables } = require('../../static/js/store/storeMain')  // storeMain.js에서 getTables 함수 가져오기

// '/storeMain' 경로에 대해 비동기 라우팅 처리
router.get("/storeMain", async (req, res) => {
    console.log('storeMain 라우트 시작');
    try {
        // 테이블 조회 함수 호출
        const tables = await getTables();
        console.log('getTables 결과:', tables);  // 콘솔에 테이블 목록 출력

        // 테이블 목록을 클라이언트로 전달하여 렌더링
        res.render('store/storeMain.html', { tables });  // storeMain.html에 데이터 전달
    } catch (error) {
        console.error('에러 발생:', error);
        res.status(500).send('데이터베이스 조회 중 오류가 발생했습니다.');
    }
});

module.exports = router;