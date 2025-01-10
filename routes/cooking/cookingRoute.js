const express = require('express');
const router = express.Router();

//http:/localhost:8888 / 경로로 접근 시
router.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})
// 로그인
router.get("/login", (request,response)=>
{
    response.render("Test.html")
}
)
// 로그인 테스트
router.post("/gologin",(req,res)=>
{
    const memberId = req.body.memberId;
    const memberPw = req.body.memberPw;

    res.render("Test2.html",{
        id:memberId,
        pw:memberPw
    });
});

// 쿠킹 클래스 메인 페이지
router.get("/searchClass",(req,res)=>
{
    res.render("searchClass.html")
});

// 클래스 등록 ㅔㅍ이지
router.get("/registerClass",(req,res)=>
{
    res.render("registerClass.html")
});


module.exports = router;