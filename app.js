//express 불러오기
const express = require("express");
//express 사용
const app = express();
//포트번호 설정
const port = 8888;
//nunjucks 불러오기
const nunjucks = require("nunjucks");
// //nunjucks 세팅
const path = require('path');
const fs = require('fs');
// db 세팅
const pool = require('./config/db.js');

//Cors 세팅
const cors = require('cors');
app.use(cors());


//body 파싱 하기위한 미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.use((req, res, next) => {
    // console.log("현재 세션 데이터:", req.session);
    res.locals.session = req.session;
    next();
});

app.use(flash());
// 정적 파일 제공 (브라우저에서 접근 가능하도록 설정 /uploadFile 경로로 실제 경로의 파일 추적 가능)
app.use("/uploadFile", express.static(process.env.FILE_PATH));
//라우터 불러오기 
const cookingRouter = require('./routes/cooking/cookingRoute.js');
const recipeRouter = require('./routes/recipe/recipeRoute.js');
const memberRouter = require('./routes/member/memberRoute.js');
const naverRouter = require('./routes/member/naverRoute.js');
const storeRouter = require('./routes/store/storeRoute.js');

// 라우터 미들웨어 등록
app.use('/' , cookingRouter);
app.use('/cooking' , cookingRouter);
app.use('/recipe' , recipeRouter);
app.use('/store', storeRouter);
// - member 미들웨어
app.use('/member' , memberRouter);
app.use('/naver', naverRouter);
app.get('/', (req, res) => {
    res.redirect('/recipe/list');
});

// view 모든 하위 폴더 지정
function getAllSubfolders(directory) {
    return fs.readdirSync(directory)
        .filter(file => fs.statSync(path.join(directory, file)).isDirectory())
        .map(folder => path.join(directory, folder));
}
//view 하위 폴더 설정 2
const viewPaths = [path.join(__dirname, 'views'), ...getAllSubfolders(path.join(__dirname, 'views'))];
// static 모든 하위 폴더 지정
app.use('/static', express.static(path.join(__dirname, 'static')));

// upload 모든 하위 파일 지정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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