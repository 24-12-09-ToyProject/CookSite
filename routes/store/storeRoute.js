const express = require('express');
const router = express.Router();
const { getAllProducts, getProductsByCategory } = require('../../static/js/store/storeMain')  // storeMain.js에서 getTables 함수 가져오기
const { getProductDetails } = require('../../static/js/store/storeDetail');  // 경로 확인
// 모든 상품 조회
router.get('/all', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.render('store/storeMain.html', { tables: products, currentCategory: 'all' });
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).send('Internal Server Error');
    }
});
// 카테고리별 상품 조회
router.get('/category/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const products = await getProductsByCategory(categoryId);
        res.render('store/storeMain.html', { tables: products, currentCategory: categoryId });
    } catch (error) {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/product/:id', async (req, res) => {
    const productId = req.params.id; // URL에서 상품 ID 가져오기
    try {
        const details = await getProductDetails(productId); // 상품 상세 정보 조회
        res.render('store/storeDetail.html', { details }); // productDetail.html에 데이터 전달
    } catch (err) {
        console.error(err);
        res.status(500).send('상품 정보를 불러오는데 실패했습니다.');
    }
});

router.post('/order', async (req, res) => {
    try {
        const {
            productImg,
            productName,
            selectedOptions,
            totalPrice
        } = req.body;

        // JSON 문자열을 객체로 파싱
        const optionsData = JSON.parse(selectedOptions);

        // 주문 페이지로 데이터 전달
        res.render('store/orderPage.html', {
            orderData: {
                productImg,
                productName,
                options: optionsData,
                totalPrice: parseInt(totalPrice).toLocaleString() + " 원"
            }
        });
    } catch (err) {
        console.error('주문 처리 중 오류:', err);
        res.status(500).send('주문 처리 중 오류가 발생했습니다.');
    }
});
module.exports = router;