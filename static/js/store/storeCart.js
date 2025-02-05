// static/js/store/storeCart.js
const db = require('../../../config/db');

// 장바구니 상품 추가
async function addToCart({ userId, productNo, optionNo, quantity }) {
    try {
        // 동일한 상품과 옵션이 있는지 확인
        const [existing] = await db.execute(
            `SELECT cart_no, quantity 
            FROM cart 
            WHERE Member_id = ? AND product_no = ? AND option_no = ?`,
            [userId, productNo, optionNo]
        );

        if (existing.length > 0) {
            // 이미 존재하면 수량만 업데이트
            await db.execute(
                `UPDATE cart 
                SET quantity = quantity + ? 
                WHERE cart_no = ?`,
                [quantity, existing[0].cart_no]
            );
        } else {
            // 새로운 상품 추가
            try {
                const [result] = await db.execute(
                    `INSERT INTO cart (member_id, product_no, option_no, quantity) 
                    VALUES (?, ?, ?, ?)`,
                    [userId, productNo, optionNo, quantity]
                );
                console.log('DB insert result:', result); // 결과 로깅
            } catch (error) {
                console.error('장바구니 추가 에러:', error);
                throw error;
            }
        }

        return true;
    } catch (error) {
        console.error('장바구니 추가 에러:', error);
        throw error;
    }
}

// 장바구니 목록 조회
async function getCartItems(userId) {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM CART WHERE MEMBER_ID = ?`,
            [userId]
        );

        return rows.map(row => ({
            cartNo: row.cart_no,
            productNo: row.product_no,
            productName: row.product_name,
            productImg: row.product_img,
            optionName: row.option_name,
            quantity: row.quantity,
            price: row.base_price + (row.option_price_diff || 0)
        }));
    } catch (error) {
        console.error('장바구니 조회 에러:', error);
        throw error;
    }
}

// 장바구니 상품 삭제
async function removeCartItem(userId, cartNo) {
    try {
        await db.execute(
            `DELETE FROM cart 
             WHERE cart_no = ? AND member_id = ?`,
            [cartNo, userId]
        );
        return true;
    } catch (error) {
        console.error('장바구니 삭제 에러:', error);
        throw error;
    }
}

// 장바구니 수량 업데이트
async function updateCartQuantity(userId, cartNo, quantity) {
    try {
        if (quantity < 1) {
            return await removeCartItem(userId, cartNo);
        }

        await db.execute(
            `UPDATE cart 
             SET quantity = ? 
             WHERE cart_no = ? AND member_id = ?`,
            [quantity, cartNo, userId]
        );
        return true;
    } catch (error) {
        console.error('수량 업데이트 에러:', error);
        throw error;
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem,
    updateCartQuantity
};