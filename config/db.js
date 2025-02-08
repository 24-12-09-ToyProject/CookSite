const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    connectionLimit : 10, // 최대 10개 만듦
    host : '0.tcp.jp.ngrok.io', // host 주소는 고정
    user : 'cooksite',
    password : 'cooksite',
    database : 'test1',
    debug : false,
    port: '11277' // 포트번호 반드시 업데이트 후 사용!! 


    // db정보들은 공유되면 안되기 떄문에 파일을 따로만들어 관리
    // 소스코드와 중요한 정보를 분리시킬 수 있음.
})

module.exports = pool;