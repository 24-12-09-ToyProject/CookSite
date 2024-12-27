const express = require('express');
const router = express.Router();

//http:/localhost:8888 / 경로로 접근 시
router.get("/" , (request,response)=>{
    response.send("수정 되었습니다.");
})
router.get("/login", (request,response)=>
{
    response.render("Test.html")
}
)
router.post("/gologin",(req,res)=>
{
    const memberId = req.body.memberId;
    const memberPw = req.body.memberPw;

    res.render("Test2.html",{
        id:memberId,
        pw:memberPw
    });
});
router.get("/searchClass",(req,res)=>
{
    res.render("searchClass.html")
});


module.exports = router;