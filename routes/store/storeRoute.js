const express = require('express');
const app = express();
const router = express.Router();
const { getAllProducts, getProductsByCategory } = require('../../static/js/store/storeMain')  // storeMain.js에서 getTables 함수 가져오기
const { getProductDetails } = require('../../static/js/store/storeDetail');  // 경로 확인
const { checkLogin } = require('../member/checkLogin.js');
const { addToCart, getCartItems } = require('../../static/js/store/storeCart.js');
const orderService = require('../../static/js/store/orderPage.js');

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

        res.render('store/storeCart.html', {
            cart: cartItems,
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
        const { selectedOptionsData } = req.body;
        // console.log("주문데이터:" + selectedOptionsData);
        const optionsData = selectedOptionsData ? JSON.parse(selectedOptionsData) : [];

        // 상품별로 옵션을 그룹화
        const productGroups = {};
        optionsData.forEach(option => {
            const productKey = `${option.productName}_${option.productImg}`;
            if (!productGroups[productKey]) {
                productGroups[productKey] = {
                    productNo: option.productNo,
                    productImg: option.productImg,
                    productName: option.productName,
                    options: []
                };
            }
            productGroups[productKey].options.push({
                optionNo: option.optionNo,
                optionName: option.optionName,
                quantity: option.quantity,
                optionPrice: (option.optionPrice) * (option.quantity)
            });
        });

        // 총 가격 계산
        const optionPrice = optionsData.reduce((sum, item) => sum + (item.optionPrice * item.quantity), 0);

        res.render('store/orderPage.html', {
            orderData: {
                productGroups: Object.values(productGroups),
                optionPrice,
                userId: req.session.user.id
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '주문 처리 중 오류가 발생했습니다.' });
    }
});
router.post('/payments/complete', checkLogin, async (req, res) => {
    try {
        const { imp_uid, merchant_uid, total_price, member_id, shippingInfo, orderItems, pay_method } = req.body;

        // console.log("결제 응답:", req.body);

        // 주문 데이터 구성
        const orderData = {
            imp_uid,
            merchant_uid,
            total_price,
            member_id,
            shippingInfo,
            pay_method,
            orderItems
        };

        // 주문 생성 및 결제 처리
        const orderId = await orderService.createOrder(orderData);
        
        // 결제 검증
        await orderService.verifyPayment(orderId, {
            imp_uid: imp_uid, // imp_uid를 전달
            merchant_uid,
            amount: total_price,
            pay_method: pay_method
        });

        res.json({ 
            success: true, 
            orderId,
            message: '주문이 성공적으로 처리되었습니다.'
        });

    } catch (error) {
        console.error('주문 처리 중 오류 발생:', error);
        res.status(500).json({ 
            success: false, 
            message: '주문 처리 중 오류가 발생했습니다.',
            error: error.message 
        });
    }
});




router.get('/order/history', checkLogin, async (req, res) => {
    try {
        const orders = await orderService.getOrderHistory(req.session.user.id);
        // console.log(orders);
        res.render('store/myOrder.html', { orders });  // 템플릿 렌더링
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: '주문 내역을 불러오는데 실패했습니다.' });
    }
});
module.exports = router;