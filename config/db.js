const mysql = require('mysql2')

const pool = mysql.createPool({
    connectionLimit : 10, // 최대 10개 만듦
    host : 'localhost', // host 주소는 고정
    user : 'cooksite',
    password : 'cooksite',
    database : 'test1',
    debug : false,
    port: 8800 // 포트번호 반드시 업데이트 후 사용!! 


    // db정보들은 공유되면 안되기 떄문에 파일을 따로만들어 관리
    // 소스코드와 중요한 정보를 분리시킬 수 있음.
}).promise();

// 보안유지를 위한 DB정보 분리 및 아래의 예시 "쿼리문" 은 app.js에서 테스트 했음.
// 자바의 mapper 형태의 쿼리 실행문은 Service에서 아래 예시문과 비슷한 형태로 실행하는것으로 보임


// pool.getConnection((err, conn)=>{

//     const exec = conn.query('select * from users;',
//         // 쿼리문을 실행한 이후 콜백 실행 됨

//         (err, rows)=>{
//             conn.release();
//             console.log("실행된 SQL query : " + exec.sql);
            

//             // rows에 내장된 속성들이 있음
//             if(rows.length > 0){
//                 console.log("데이터 하나 이상 있음");
//                 console.log(rows[0]);
                
//                 return;
                
//             }else{
//                 console.log("데이터 없음");
                
//                 return;
//             }
//         }
//     )
// })


module.exports = pool;