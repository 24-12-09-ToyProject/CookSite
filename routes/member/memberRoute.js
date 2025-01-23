const express = require('express');

const { hashValue, verifyValue } = require('../../static/js/member/argon.js');

const { signUpMember, checkDuplicateId } = require('../../services/member/memberService.js');

const router = express.Router();

router.get('/login', (req, res)=>{

	let signupResult = req.flash('signupResult');

	if (!req.session.user) {
		console.log(signupResult);
		
		res.render('login.html', {signupResult:signupResult});  // 로그인 페이지 내용
	} else {
			res.redirect('/member/mypage'); // 임시
	}
});

router.post('/login', (req, res)=>{
	const { memberId, memberPw } = req.body;
	
	
	if(!req.session.user){
		req.session.user = {
			id : memberId,
			pw : memberPw
		}
	}
	
	res.redirect('/member/mypage');
})

// router.post('/register', ()=>{
// 	const password = req.body.memberPw;
// 	// 패스워드 정규표현식
// 	const regexPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/; // 최소 8자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자
// 	if(regexPw.test(password)){
// 		res.status(200).send('성공!');
// 	}else{
// 		res.status(400).send('실패')
// 	}

// 	// 정규표현식 -> 클라이언트, 서버측에서 모두 확인해줘야 함!!
// })


// req.session.destroy();  -> logout 시 




router.get('/mypage', (req, res)=>{
	res.render('mypage.html');
})

// 회원가입 페이지 이동
router.get('/signUp', (req, res)=>{
	res.render('register.html')
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

		// // 비밀번호 검증 (올바른 비밀번호)
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
		let resultMessage = signUpMember(memberJson);

		console.log(resultMessage);
		

		if(resultMessage === 'insert 성공'){
			req.flash('signupResult', 'success');
		}else{
			req.flash('signupResult', 'fail');
		}

		res.redirect('/member/login');

	} catch (error) {
		console.error('오류 발생:', error);
		res.status(500).send('회원가입 처리 중 오류가 발생했습니다.');
	}

});



// api - 아이디 중복체크
router.post('/api/check-duplicate-id', async (req, res) => {
	const { memberId } = req.body;

	checkDuplicateId(memberId, (resultMessage)=>{

		console.log("resultMessage " + resultMessage);
		
		if(resultMessage === '이미 존재하는 아이디'){
			return res.status(200).json({success:false, message:resultMessage});
		}else if(resultMessage === '사용 가능한 아이디'){
			return res.status(200).json({success:true, message:resultMessage});
		}else{
			return res.status(500).json({success:false, message:resultMessage});
		}

	});
	
});


module.exports = router;
