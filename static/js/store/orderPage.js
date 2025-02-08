// static/js/store/storeCart.js
const pool = require('../../../config/db');

const orderService = {
    async createOrder(orderData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. 주문 기본 정보 저장
            const [orderResult] = await connection.query(
                `INSERT INTO storeorders (
                    imp_uid, merchant_uid, total_price, member_id, 
                    shipping_name, shipping_email, shipping_tel, 
                    shipping_address, shipping_postcode
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    orderData.imp_uid,
                    orderData.merchant_uid,
                    orderData.total_price,
                    orderData.member_id,
                    orderData.shippingInfo.name,
                    orderData.shippingInfo.email,
                    orderData.shippingInfo.phone,
                    orderData.shippingInfo.address,
                    orderData.shippingInfo.postcode
                ]
            );

            const orderId = orderResult.insertId;

            // 2. 주문 상품 정보 저장
            const orderItems = orderData.orderItems.map(item => [
                orderId,
                item.product_no,
                item.option_no,
                item.quantity
            ]);

            await connection.query(
                `INSERT INTO store_order_items 
                (order_id, product_no, option_no, quantity) 
                VALUES ?`,
                [orderItems]
            );

            await connection.commit();
            return orderId;

        } catch (error) {
            await connection.rollback();
            throw new Error(`주문 생성 실패: ${error.message}`);
        } finally {
            connection.release();
        }
    },

    async verifyPayment(orderId, paymentInfo) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 결제 정보 저장 (storepayment 테이블에 저장)
            await connection.query(
                'INSERT INTO storepayment (order_id, imp_uid, merchant_uid, amount, pay_method, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, paymentInfo.imp_uid, paymentInfo.merchant_uid, paymentInfo.amount, paymentInfo.pay_method, 'PAID']
            );

            // 주문 상태 업데이트 (PAID)
            await connection.query(
                'UPDATE storepayment SET payment_status = ? WHERE order_id = ?',
                ['PAID', orderId]
            );

            await connection.commit();
            return true;

        } catch (error) {
            await connection.rollback();
            throw new Error(`결제 검증 실패: ${error.message}`);
        } finally {
            connection.release();
        }
    },

    async getOrderHistory(memberId) {
        try {
            const [orders] = await pool.query(
                `SELECT 
                    o.order_id,
                    o.merchant_uid,
                    FORMAT(o.total_price, 0) AS total_price,
                    MAX(s.payment_status) as payment_status,
                    o.created_at,
                    o.shipping_name,
                    o.shipping_address,
                    GROUP_CONCAT(p.ppoduct_main_img_url ORDER BY oi.order_item_id ASC) AS product_images,                    GROUP_CONCAT(p.product_name) as products,
                    GROUP_CONCAT(oi.quantity) as quantities
                FROM storeorders o
                JOIN store_order_items oi ON o.order_id = oi.order_id
                JOIN product p ON oi.product_no = p.product_no
                JOIN storepayment s ON o.order_id = s.order_id
                WHERE o.member_id = ?
                GROUP BY o.order_id
                ORDER BY o.created_at DESC`,
                [memberId]
            );
            return orders;
        } catch (error) {
            throw new Error(`주문 내역 조회 실패: ${error.message}`);
        }
    }
};

module.exports = orderService;