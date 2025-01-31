const express = require('express');
const { hashValue, verifyValue } = require('../../static/js/member/argon.js');
const { signUpMember, checkDuplicateId, checkAccount, findAccount, verifyEmailCode } = require('../../services/member/memberService.js');
const { checkLogin } = require('../member/checkLogin.js');
const router = express.Router();

// 로그인 페이지 이동
router.get('/login', (req, res)=>{

	let signupResult = req.flash('signupResult');
	let loggedInMessage = req.flash('loggedInMessage');

	if (!req.session.user) {
		// console.log("flashMessage_signupResult : " + signupResult);
		
		res.render('login.html', {signupResult:signupResult, loggedInMessage:loggedInMessage}, );  // 로그인 페이지 내용
	} else {
			res.redirect('/member/mypage'); // 임시
	}
});

// 로그인 실행
router.post('/login', async (req, res)=>{
	const { memberId, memberPw } = req.body;
 try {
		// 아이디, 패스워드 검증 service
		let resultMessage = await checkAccount(memberId, memberPw);

		// console.log("resultMessage :" + resultMessage);
		

		if(resultMessage === "존재하는 계정"){
			req.session.user = {
				id : memberId,
				loggedIn : true
			}

			res.send("로그인 성공");

		}else if(resultMessage === "존재하지 않는 계정"){
			res.send("로그인 실패")
		}else if(resultMessage === "존재하지 않는 아이디"){
			res.send("존재하지 않는 아이디")
		}else{
			res.send("로그인 중 오류발생");
		}
	} catch (error) {
		res.send("로그인 중 오류발생");
	}

	
});


// 마이페이지 이동
router.get('/mypage', checkLogin, (req, res)=>{
	res.render('mypage.html');
})

// 회원가입 페이지 이동
router.get('/signUp', (req, res)=>{
	res.render('register.html');
})

router.get('/findAccount', (req, res) => {
	res.render('findAccount.html');
})


// 회원가입 실행
router.post('/signUp', async (req, res)=>{
	try {
		const memberJson = req.body;

		// 해싱할 비밀번호 값
		const plainvalue = memberJson.memberPw;

		// 비밀번호 해싱
		console.log('-----------------------------------------------------------------');
		console.log('해시처리 시작');
		const hashedvalue = await hashValue(plainvalue);

		// 해싱한 비밀번호로 수정
		memberJson.memberPw = hashedvalue;

		// 비밀번호 검증 (올바른 비밀번호)
		// console.log('-----------------------------------------------------------------');
		// console.log(plainvalue, ' =>이 값 검증');
		// await verifyValue(hashedvalue, plainvalue);

		// // 비밀번호 검증 (잘못된 비밀번호)
		// console.log('-----------------------------------------------------------------');
		// const wrongvalue = '잘못된 값 넣어서 체크해보겠음';
		// console.log(wrongvalue, ' =>이 값 검증');
		// await verifyValue(hashedvalue, wrongvalue);

		console.log('회원 정보:', memberJson);

		// service - 회원가입 쿼리문 실행
		
		let resultMessage = await signUpMember(memberJson, plainvalue);

		console.log(resultMessage);
		

		if(resultMessage === '회원가입 성공'){
			req.flash('signupResult', 'success');
		}else{
			req.flash('signupResult', 'fail');
		}

		res.redirect('/member/login');

	} catch (error) {
		console.error('오류 발생:', error);
		req.flash('signupResult', 'fail');
		res.redirect('/member/login');
	}

});



// api - 아이디 중복체크
router.post('/api/check-duplicate-id', async (req, res) => {
	const { memberId } = req.body;

	console.log('/api/check-duplicate-id ' +memberId);
	

	const resultMessage = await checkDuplicateId(memberId);
	console.log(resultMessage);
	
		
	if(resultMessage === '이미 존재하는 아이디'){
		return res.status(200).json({success:false, message:resultMessage});
	}else if(resultMessage === '사용 가능한 아이디'){
		return res.status(200).json({success:true, message:resultMessage});
	}else{
		return res.status(500).json({success:false, message:resultMessage});
	}
	
});

// api - 아이디 찾기
router.post('/api/find-id', async (req, res) => {
	const { memberName, email } = req.body;

	console.log('/api/find-id' + memberName + " / " + email);

	let {resultMessage, maskedId} = await findAccount(memberName, email);


	if(resultMessage === "존재하는 계정"){
		res.status(200).json({success:true, maskedId:maskedId});

	}else if(resultMessage === "존재하지 않는 계정"){
		console.log("else if 실행됨");
		
		res.status(200).json({success:false, maskedId:maskedId});
	}

})

const emailAuth = require('../../services/member/emailAuth.js')
// api - 이메일 인증
router.post('/api/send-email', async (req, res) => {
	emailAuth.SendMail(req, res);
	// SendMail 안에서 응답 처리
})

router.post('/api/verify-emailCode', async (req, res) => {
	const {email, emailCode} = req.body;
	const result = await verifyEmailCode(email, emailCode);

	console.log("verifyEmailCode : " + result);

	if(result === '인증 성공'){
		res.json({success : true, message : '인증 성공'})
	}else if(result === '인증 실패'){
		res.json({success : false, message : '인증 실패'})
	}
	
})




module.exports = router;
