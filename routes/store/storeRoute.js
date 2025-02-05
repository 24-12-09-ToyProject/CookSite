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
        console.log(req.body);
        const userId = req.session.user.id;
        const cartItems = await getCartItems(userId);

        // 총 상품 금액 계산
        // const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // 배송비 계산 (7만원 이상 무료배송)
        // const shippingFee = totalPrice >= 70000 ? 0 : 3500;

        res.render('store/storeCart.html', {
            cart: cartItems,
            // totalPrice,
            // shippingFee
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
        // console.log(req.body);
        const { selectedOptionsData } = req.body;
        const optionsData = selectedOptionsData ? JSON.parse(selectedOptionsData) : [];

        // 상품별로 옵션을 그룹화
        const productGroups = {};
        optionsData.forEach(option => {
            const productKey = `${option.productName}_${option.productImg}`;
            if (!productGroups[productKey]) {
                productGroups[productKey] = {
                    productImg: option.productImg,
                    productName: option.productName,
                    optionNo: option.optionNo, // 추가
                    options: []
                };
            }
            productGroups[productKey].options.push({
                optionName: option.optionName,
                quantity: option.quantity,
                optionPrice: (option.optionPrice)*(option.quantity)
            });
        });

        // 총 가격 계산
        const totalPrice = optionsData.reduce((sum, item) => sum + (item.optionPrice * item.quantity), 0);

        res.render('store/orderPage.html', {
            orderData: {
                productGroups: Object.values(productGroups),
                totalPrice,
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
        const { imp_uid, merchant_uid, productInfo, shippingInfo } = req.body;
        
        const orderRecords = productInfo.options.map(option => ({
            product_no: option.productNo,
            quantity: option.quantity,
            member_id: req.session.user.id
        }));

        const orderId = await orderService.createOrder(orderRecords, shippingInfo);
        await orderService.verifyPayment(orderId, {
            merchant_uid,
            amount: productInfo.totalPrice,
            pay_method: req.body.pay_method
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ success: false, error: '결제 처리 중 오류가 발생했습니다.' });
    }
});

router.get('/order/history', checkLogin, async (req, res) => {
    try {
        const orders = await orderService.getOrderHistory(req.session.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: '주문 내역을 불러오는데 실패했습니다.' });
    }
});
module.exports = router;