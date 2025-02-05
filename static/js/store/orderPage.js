const pool = require('../../../config/db');

const orderService = {
    async createOrder(orderRecords, shippingInfo) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // 주문 생성
            const [orderResult] = await connection.query(
                'INSERT INTO storeorders (product_no, quantity, member_id) VALUES ?',
                [orderRecords.map(record => [record.product_no, record.quantity, record.member_id])]
            );

            // 배송 정보 저장
            await connection.query(
                `INSERT INTO shipping_info 
                (order_id, name, phone, email, address, postcode) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [orderResult.insertId, shippingInfo.name, shippingInfo.phone, 
                 shippingInfo.email, shippingInfo.address, shippingInfo.postcode]
            );

            await connection.commit();
            return orderResult.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async verifyPayment(orderId, paymentInfo) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                'INSERT INTO storepayment (order_id, merchant_uid, amount, pay_method) VALUES (?, ?, ?, ?)',
                [orderId, paymentInfo.merchant_uid, paymentInfo.amount, paymentInfo.pay_method]
            );

            await connection.query(
                'UPDATE storeorders SET payment_status = ? WHERE order_id = ?',
                ['PAID', orderId]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async getOrderHistory(memberId) {
        const [orders] = await pool.query(
            `SELECT o.*, p.merchant_uid, p.amount, p.pay_method, pr.product_name, s.name, s.phone, s.address
             FROM storeorders o
             JOIN storepayment p ON o.order_id = p.order_id
             JOIN product pr ON o.product_no = pr.product_no
             JOIN shipping_info s ON o.order_id = s.order_id
             WHERE o.member_id = ?
             ORDER BY o.created_at DESC`,
            [memberId]
        );
        return orders;
    }
};

module.exports = orderService;