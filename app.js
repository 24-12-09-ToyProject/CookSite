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
// view 모든 하위 폴더 설정
function getAllSubfolders(directory) {
    return fs.readdirSync(directory)
        .filter(file => fs.statSync(path.join(directory, file)).isDirectory())
        .map(folder => path.join(directory, folder));
}
//view 하위 폴더 설정 2
const viewPaths = [path.join(__dirname, 'views'), ...getAllSubfolders(path.join(__dirname, 'views'))];


app.set("view engine" , "html")
nunjucks.configure(viewPaths, {
    express: app,
    watch: true
})

// http 서버 실행
app.listen(port, () =>{
    console.log("서버가 정상적으로 실행 되었습니다");
});

//http:/localhost:8888 / 경로로 접근 시
app.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})
app.get("/login", (request,response)=>
{
    response.render("Test.html")
}
)

