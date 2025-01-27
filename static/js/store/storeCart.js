const promisePool = require('../../../config/db');

async function getCartList(productId) {
    try {
        // 상품 정보 조회
        const [product] = await promisePool.query(
            'SELECT * FROM product WHERE PRODUCT_NO = ?;',
            [productId]
        );

        // 옵션 정보 조회 (수정된 컬럼에 맞게 조회)
        const [options] = await promisePool.query(
            'SELECT OPTION_NO, PRODUCT_NO, OPTION_NAME, OPTION_PRICE_DIFF, OPTION_STOCK FROM productoption WHERE PRODUCT_NO = ?;',
            [productId]
        );

        return {
            product: product[0], // 단일 상품 정보
            options: options // 해당 상품의 옵션 리스트
        };
    } catch (err) {
        console.error('Error executing query:', err);
        throw err; // 에러를 던져서 라우터에서 처리할 수 있게 함
    }
}


module.exports = { getProductDetails };