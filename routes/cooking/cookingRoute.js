const express = require('express');
const router = express.Router();

//http:/localhost:8888 / 경로로 접근 시
router.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})

// db 세팅
const pool = require('../../config/db.js');

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

//검색 조건
router.post("/api/cooking/filter", async (req, res) => {
    const { region, classType, category, visitor, weekdays, difficulty, timeMin, timeMax, priceMin, priceMax } = req.body;

    let query = `SELECT CLASS_IMAGE_URL , CLASS_TITLE, CLASS_CATEGORY FROM cooking WHERE 1=1`;
    const params = [];

    if (region) {
        query += ` AND CLASS_LOCATION = ? OR ? IS NULL`;
        params.push(region);
    }
    if (classType) {
        query += ` AND CLASS_TYPE = ? OR ? IS NULL`;
        params.push(classType);
    }
    if (category) {
        query += ` AND CLASS_CATEGORY = ? OR ? IS NULL`;
        params.push(category);
    }
    if (visitor) {
        query += ` AND CLASS_PEOPLE_RECRUITED = ? OR ? IS NULL`;
        params.push(visitor);
    }
    if (weekdays && weekdays.length > 0) {
        query += ` AND CLASS_DATE = ? OR ? IS NULL`;
        params.push(weekdays);
    }
    if (difficulty && difficulty.length > 0) {
        query += ` AND CLASS_DIFFICULTY_LEVEL = ?  OR ? IS NULL`;
        params.push(difficulty);
    }
    if (timeMin && timeMax) {
        query += ` AND CLASS_START_TIME >= ? AND CLASS_END_TIME <= ?`;
        params.push(timeMin, timeMax);
    }
    if (priceMin !== undefined && priceMax !== undefined) {
        query += ` AND CLASS_PRICE BETWEEN ? AND ?`;
        params.push(priceMin, priceMax);
    }
    console.log ("파라미터 확인하기 : " + params);
    try {
        const [results] = await pool.execute(query, params);
        res.json(results);
    } catch (error) {
        console.error("쿼리 실행 오류:", error);
        res.status(500).send("서버 오류");
    }
});


module.exports = router;