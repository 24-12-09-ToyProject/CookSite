// js/storeMain.js
const promisePool = require('../../../config/db');

async function getTables() {
    try {
        console.log('쿼리 실행 중...');
        const [rows] = await promisePool.query('SELECT * FROM product;');
        console.log('Tables:', rows);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;  // 에러를 던져서 라우터에서 처리할 수 있게 함
    }
}

module.exports = { getTables };  // 함수를 내보내기

