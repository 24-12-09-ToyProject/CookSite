const express = require('express');
const router = express.Router();
//google-Cloud 불러오기
const gc = require('../../config/googlecloud.js');


//http:/localhost:8888 / 경로로 접근 시
router.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})

// db 세팅
const pool = require('../../config/db.js');

//쿠킹 컨트롤러 호출
const cookingController = require('../../controllers/cooking/cookingController.js');
router.post('/api/cooking/filter',cookingController.searchClass);
router.post('/api/cooking/insert',cookingController.createClass);
// multer 설정 가져오기
const { upload } = require('../../config/googlecloud.js');
router.post('/upload',upload.single('image'), cookingController.uploadFileToGCS);
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
// 클래스 등록 추가 페이지
router.get("/createClass",(req,res)=>
{
    res.render("createClass.html")
});

// 클래스 내용 전달
// 실제 데이터는 데이터베이스에서 가져오거나 동적으로 생성
router.get("/api/cooking",(req,res)=>{
    let query = ` `
    const cardData = [
        {
            img: "../../static/img/cooking/화면 캡처 2025-01-12 135101.png",
            title: "의류패턴제작과 수선",
            category: "핸드메이드",
            price: "260,000원",
            location: "서울",
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
        ];
        res.json(cardData);
})


module.exports = router;