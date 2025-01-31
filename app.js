//express 불러오기
const express = require("express");
//express 사용
const app = express();
//포트번호 설정
const port = 8888;
//nunjucks 불러오기
const nunjucks = require("nunjucks");
//nunjucks 세팅
const path = require('path');
const fs = require('fs');

// db 세팅
const pool = require('./config/db.js');


//body 파싱 하기위한 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//-------------------------
// member 미들웨어 등록 - session
const cookieParser = require('cookie-parser');
const session = require('express-session');

// session  connect-flash
const flash = require('connect-flash');

require('dotenv').config({path:"./config/.env"});

const SECRET_KEY = process.env.SECRET_KEY;


app.use(cookieParser(SECRET_KEY));
app.use(session({
    secret : SECRET_KEY,
    resave : false,
    saveUninitialized : false,
    cookie : {
        httpOnly : true,
        secure : false,
        maxAge: 1000 * 60 * 60 // 1시간 이후 session 파괴
    }
}));
app.use(flash());

// static 경로 설정
// app.use(express.static('static'));
//------------------------


//라우터 불러오기 
const cookingRouter = require('./routes/cooking/cookingRoute.js');
// - member 라우터
const memberRouter = require('./routes/member/memberRoute.js');
const recipeRouter = require('./routes/recipe/recipeRoute.js');

// 라우터 미들웨어 등록
app.use('/cooking' , cookingRouter);
app.use('/recipe' , recipeRouter);
// - member 미들웨어
app.use('/member' , memberRouter);

// view 모든 하위 폴더 설정
function getAllSubfolders(directory) {
    return fs.readdirSync(directory)
        .filter(file => fs.statSync(path.join(directory, file)).isDirectory())
        .map(folder => path.join(directory, folder));
}
//view 하위 폴더 설정 2
const viewPaths = [path.join(__dirname, 'views'), ...getAllSubfolders(path.join(__dirname, 'views'))];


// html 파일 찾기
app.set("view engine" , "html")
nunjucks.configure(viewPaths, {
    express: app,
    watch: true
})

// http 서버 실행
app.listen(port, () =>{
    console.log("서버가 정상적으로 실행 되었습니다" + port);
});

// static의 모든 하위 폴더 지정
app.use('/static', express.static(path.join(__dirname, 'static')));

// 정적 파일 제공 (uploads 폴더)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//DB 테스트 
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




