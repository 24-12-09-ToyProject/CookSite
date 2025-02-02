const express = require('express');
const app = express();
const router = express.Router();
const { getAllProducts, getProductsByCategory } = require('../../static/js/store/storeMain')  // storeMain.js에서 getTables 함수 가져오기
const { getProductDetails } = require('../../static/js/store/storeDetail');  // 경로 확인
const { checkLogin } = require('../member/checkLogin.js');
const { addToCart, getCartItems } = require('../../static/js/store/storeCart.js');

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
// 장바구니 페이지 렌더링
router.get('/cart', checkLogin, async (req, res) => {
    try {

        const userId = req.session.user.id;
        const cartItems = await getCartItems(userId);

        // 총 상품 금액 계산
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // 배송비 계산 (7만원 이상 무료배송)
        const shippingFee = totalPrice >= 70000 ? 0 : 3500;

        res.render('store/storeCart.html', {
            cart: cartItems,
            totalPrice,
            shippingFee
        });
    } catch (error) {
        console.error('장바구니 조회 오류:', error);
        res.status(500).send('장바구니 정보를 불러오는데 실패했습니다.');
    }
});

// 장바구니에 상품 추가
router.post('/cart/add', checkLogin, async (req, res) => {
    const { productNo, optionNo, quantity } = req.body;
    const userId = req.session.user.id;

    try {
        await addToCart({
            userId,
            productNo,
            optionNo,
            quantity: parseInt(quantity)
        });
        res.json({ success: true, message: '장바구니에 추가되었습니다.' });
    } catch (error) {
        console.error('장바구니 추가 오류:', error);
        res.status(500).json({ success: false, message: '장바구니 추가에 실패했습니다.' });
    }
});

// 장바구니 상품 삭제
router.post('/cart/remove', checkLogin, async (req, res) => {
    const { cartNo } = req.body;
    const userId = req.session.user.id;

    try {
        await removeCartItem(userId, cartNo);
        res.json({ success: true, message: '상품이 삭제되었습니다.' });
    } catch (error) {
        console.error('장바구니 삭제 오류:', error);
        res.status(500).json({ success: false, message: '상품 삭제에 실패했습니다.' });
    }
});

// 장바구니 수량 업데이트
router.post('/cart/update', checkLogin, async (req, res) => {
    const { cartNo, quantity } = req.body;
    const userId = req.session.user.id;

    try {
        await updateCartQuantity(userId, cartNo, parseInt(quantity));
        res.json({ success: true, message: '수량이 업데이트되었습니다.' });
    } catch (error) {
        console.error('수량 업데이트 오류:', error);
        res.status(500).json({ success: false, message: '수량 업데이트에 실패했습니다.' });
    }
});

app.use(express.json());

router.post('/order', checkLogin, async (req, res) => {
    try {
        // console.log("전체 데이터:", req.body);

        // req.body에서 상품 이미지와 이름을 가져오기
        const { productImg, productName, selectedOptionsData } = req.body;

        // selectedOptionsData가 없으면 빈 배열로 처리
        const optionsData = selectedOptionsData ? JSON.parse(selectedOptionsData) : [];

        // orderItems에 파싱된 데이터를 할당
        const orderItems = optionsData.map(option => ({
            productImg,  // 상위에서 가져온 productImg 사용
            productName,  // 상위에서 가져온 productName 사용
            optionName: option.optionName,
            quantity: option.quantity,
            optionPrice: option.optionPrice
        }));

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: '주문 데이터가 없습니다.' });
        }

        // 렌더링 전에 console.log로 확인
        console.log("주문 데이터 렌더링:", orderItems);

        // 주문 총 가격 계산 (예시로 1000을 전달하는 대신 실제 계산된 가격을 사용)
        const totalPrice = orderItems.reduce((sum, item) => sum + item.optionPrice, 0);

        res.render('store/orderPage.html', {
            orderData: {
                productImg,        // 실제 이미지 URL을 전달
                productName,       // 실제 상품명을 전달
                options: orderItems, // 옵션들 전달
                totalPrice         // 실제 총 가격 계산
            },
            user: req.user
        });

    } catch (error) {
        console.error(error);  // 오류 로그 추가
        res.status(500).json({ error: '주문 처리 중 오류가 발생했습니다.' });
    }
});

module.exports = router;