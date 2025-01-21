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

// 클래스 등록 페이지
router.get("/registerClass",(req,res)=>
{
    res.render("registerClass.html")
});

// 클래스 내용 전달
// 실제 데이터는 데이터베이스에서 가져오거나 동적으로 생성
router.get("/api/cooking",(req,res)=>{
    const cardData = [
        {
            img: "../../static/img/cooking/화면 캡처 2025-01-12 135101.png",
            title: "의류패턴제작과 수선",
            category: "핸드메이드",
            price: "260,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/화면 캡처 2025-01-11 174248-fotor-20250111175520.png",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        {
            img: "../../static/img/cooking/Seul컴_에스파_Drama_카리나29.jpg",
            title: "드라이플라워 디퓨저 무드등",
            category: "플라워·가드닝",
            price: "55,000원",
            link : "#"
        },
        ];
        res.json(cardData);
})
module.exports = router;