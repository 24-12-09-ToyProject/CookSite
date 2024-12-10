//express 불러오기
const express = require("express");
//express 사용
const app = express();
//포트번호 설정
const port = 8888;

// http 서버 실행
app.listen(port, () =>{
    console.log("서버가 정상적으로 실행 되었습니다");
});

//http:/localhost:8888 / 경로로 접근 시
app.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})

