const express = require('express');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { hashValue, verifyValue } = require('../../static/js/member/argon.js');
const { signUpMember, checkDuplicateId, checkAccount, findAccount, verifyEmailCode, findPassword, updatePassword, selectInfoById, updateInfo, addProfile, removeProfile, deleteAccount } = require('../../services/member/memberService.js');
const { checkLogin } = require('../member/checkLogin.js');
const { upload } = require('../../services/member/uploadProfile.js');
const router = express.Router();

const client_id = process.env.NAVER_ID;
var redirectURI = encodeURI("http://127.0.0.1:8888/naver/callback");
var api_url = "";

// 로그인 페이지 이동
router.get('/login', (req, res)=>{
	// 회원가입 결과
	let signupResult = req.flash('signupResult');
	// checkLogin 메세지
	let loggedInMessage = req.flash('loggedInMessage');
	// loginResult 메세지
	let loginResult = req.flash('loginResult');
	// 삭제결과
	let { deleteResult } = req.query;

	const state = crypto.randomBytes(20).toString('hex');
	api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state+"&prompt=login";


	if (!req.session.user) {
		// console.log("flashMessage_signupResult : " + signupResult);
		
		res.render('login.html', {signupResult:signupResult, loggedInMessage:loggedInMessage, deleteResult:deleteResult, api_url:api_url, loginResult:loginResult});  // 로그인 페이지 내용
	} else {
			res.redirect('/member/mypage'); // 임시
	}
});

// 로그인 실행
router.post('/login', async (req, res)=>{
	const { memberId, memberPw } = req.body;
	try {
		// 아이디, 패스워드 검증 service
		let result = await checkAccount(memberId, memberPw);
		
		if(result.success){
			let filePath = result.info.file_rename ? `/uploadFile/member/${result.info.file_rename}` : "/static/img/member/user-thumbnail.png";

			req.session.user = {
				id : memberId,
				filePath:filePath,
				fileRename:result.info.file_rename,
				loggedIn : true
			}

			res.send("로그인 성공"); // index 페이지로 이동하도록 바꿔야함

		}else{
			req.flash('loginResult', 'fail')
			res.redirect('/member/login');
		}
	} catch (error) {
		res.send("로그인 중 오류발생" + error);
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

// 비밀번호 찾기 페이지 이동
router.get('/findPassword', (req, res) => {
	res.render('findPassword.html');
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
// api - 이메일 코드 전송
router.post('/api/send-email', async (req, res) => {
	emailAuth.SendMailCode(req, res);
	// SendMail 안에서 응답 처리
})

// 이메일 코드 인증
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

// 비밀번호 재설정 링크 전송
router.post('/api/find-pw', async (req, res) => {
	const { memberId, email } = req.body;

	let result = await findPassword(memberId, email);

	if(result.success){
		console.log("비밀번호 찾기 성공!!");
		
		// 토큰 생성 (JWT)
		const token = jwt.sign({ memberId }, process.env.SECRET_KEY, { expiresIn: "10m" }); // 10분간 유효
		// 이메일로 비밀번호 재설정 링크 전송
		const resetLink = `http://${process.env.SERVER_IP_ADDRESS}:8888/member/reset-password?token=${token}`;
		await emailAuth.SendMailLink(req, res, resetLink);

	}else{
		console.log("비밀번호 찾기 실패!!!");
		res.json(result);
	}

})

// 비밀번호 재설정 페이지 이동
router.get("/reset-password", (req, res) => {
  const { token } = req.query;

  try {
    // 1. 토큰 검증
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    res.render('resetPassword.html', { decodedMemberId : decoded.memberId });
  } catch (err) {
    res.status(400).send("유효하지 않은 또는 만료된 링크입니다.");
  } 
});

// 비밀번호 재설정
router.post('/api/reset-password', async (req, res) => {
	const { memberId, memberPw } = req.body;

	// 해싱할 비밀번호 값
	const plainvalue = memberPw;

	// 비밀번호 해싱
	console.log('-----------------------------------------------------------------');
	console.log('해시처리 시작');
	const hashedPw = await hashValue(plainvalue);

	try {
		const result = await updatePassword(memberId, memberPw, hashedPw);

		if(result.success){
			res.json({success : true, message : "비밀번호 재설정을 성공하였습니다"});
		}else{
			res.json({success : false, message : "비밀번호 재설정 실패"});
		}
	} catch (error) {
		if(error === '비밀번호 중복'){
			res.json({success : false, message : "이미 가입된 계정입니다"})
		}else{
			console.log("err : " + error);
			res.json({success : false, message : "비밀번호 재설정 실패"})
		}
	}

})

// 상세정보 페이지 이동
router.get('/detail', checkLogin, async (req, res) => {
	// session.user 에서 id 확인
	const memberId = req.session.user.id;
	const filePath = req.session.user.filePath;
	const provider = req.session.user.provider;
	// 해당 아이디 정보 가져오기
	const result = await selectInfoById(memberId);
	if(result.success){
		result.info.filePath = filePath;
		result.info.provider = provider;
		console.log("info : " + result.info);
		res.render('memberDetail.html', result.info);
	}else{
		res.send('정보를 가져오는 중 오류 발생');
	}
})

// 회원 정보 수정
router.post('/api/update-info', async (req, res) => {
		const memberJson = req.body;
		
		let dateOfBirth = null;
    let phone = null;
    // 생년월일 처리
    if (memberJson.year) {
      const { year, month, day } = memberJson;
      dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    if(memberJson['first-phone'] || memberJson['second-phone']){
      phone = `010-${memberJson['first-phone']}-${memberJson['second-phone']}`;
    }

	const info = {
		memberId: req.session.user.id, // 세션에서 회원 ID 가져옴
		zonecode: req.body.zonecode,
		defaultAddress: req.body['default-address'],
		detailAddress: req.body['detail-address'],
		email: req.body.email && req.body.email + (req.body.emailDomain || ""),
		gender: req.body['female-radio'] || req.body['male-radio'] || "",
		phone:phone,
		calendarType: req.body['lunar-radio'] || req.body['solar-radio'] || "",
		memberName: req.body.memberName,
		dateOfBirth:dateOfBirth,
	};

	const result = await updateInfo(info);

	res.json(result);

})

// 비밀번호 본인 확인 페이지 이동
router.get('/confirmPassword', checkLogin, async (req, res) => {
	const { from } = req.query;
	const result = req.flash('confirmPasswordResult');
	
	// social 회원의 경우 렌더링 없이 바로 삭제 후 로그인 페이지 이동
	if(from === 'deleteSocial'){
		// 회원 탈퇴
		const memberId = req.session.user.id;
		console.log("탈퇴되는 아이디 : " + memberId);
		
		const deleteResult = await deleteAccount(memberId, null);
		if(deleteResult.success){
			 // 세션 삭제 (로그아웃 처리)
			req.session.destroy(err => {
				if (err) {
						console.error('세션 삭제 오류:', err);
						return res.status(500).send('세션 파괴 실패');
				}
				
				res.redirect('/member/login?deleteResult=success'); // 로그인 페이지로 이동
			})

		}else{
			res.send('삭제 오류');
		}
	}else{
		res.render('confirmPassword.html', {confirmPasswordResult:result, from:from});
	}


})


// 비밀번호 본인 확인 
router.post('/api/confirm-password', async (req, res) => {
	const { from } = req.body;

	const memberId = req.session.user.id;
	const currentProfile = req.session.user.fileRename;

	if(!memberId){
		req.flash('loggedInMessage', '로그아웃상태');
		location.href="/member/login";
	}
	const { memberPw } = req.body;
	try {
		// 아이디, 패스워드 검증 service
		let result = await checkAccount(memberId, memberPw);
		
		if(result.message === "존재하는 계정"){
			// from = resetPw 일 경우 비밀번호 재설정 페이지 이동 및 토큰 생성
			// from = deleteAccount 일 경우 삭제 로직 처리

			if(from === 'resetPw'){
				// 토큰 생성 (JWT)
				const token = jwt.sign({ memberId }, process.env.SECRET_KEY, { expiresIn: "10m" }); // 10분간 유효
				// 이메일로 비밀번호 재설정 링크 전송
				res.redirect(`/member/reset-password?token=${token}`);
			}else if(from === 'deleteAccount'){
				// 회원 탈퇴
				const deleteResult = await deleteAccount(memberId, currentProfile);
				if(deleteResult.success){
					 // 세션 삭제 (로그아웃 처리)
					req.session.destroy(err => {
						if (err) {
								console.error('세션 삭제 오류:', err);
								return res.status(500).send('세션 파괴 실패');
						}
						
						res.redirect('/member/login?deleteResult=success'); // 로그인 페이지로 이동
					});


				}else{
					res.send('삭제 오류');
				}
			}


		}else if(result.message === "존재하지 않는 계정"){
			req.flash('confirmPasswordResult', 'fail');
			res.redirect('/member/confirmPassword');
		}else{
			res.send("로그인 중 오류발생");
		}
	} catch (error) {
		res.send("로그인 중 오류발생");
	}
})



// 프로필 이미지 업로드
router.post('/api/upload-profile', checkLogin, upload.single('profileImage'), async (req, res) => {

	const memberId = req.session.user.id;
	
	try {
	// db에 저장될 파일 정보
	const fileInfo = {
		memberId:memberId,
		fileName:req.file.originalname,
		fileReName:req.file.filename,
		filePath:`${process.env.FILE_PATH}member/`
	}

	if (!req.file) {
    return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }

    // DB에 이미지 경로 저장
		const result = await addProfile(fileInfo);
		if(result.success){
			// 세션에 즉시 수정
			req.session.user.filePath=`/uploadFile/member/${req.file.filename}`;
			req.session.user.fileRename=`${req.file.filename}`;
			// 클라이언트에 업로드된 파일 경로 응답
			res.json({
				success:true,
				message: '프로필 이미지가 성공적으로 업로드되었습니다.',
				filePath: `/uploadFile/member/${req.file.filename}` // url에서 사용할 주소 (경로 변환됨)
			});
		}else{
			res.json({
				success:false,
				message: '프로필 추가 실패'
			});
		}

  } catch (error) {
    console.error("DB 저장 오류:", error);
    res.status(500).json({ message: "DB 저장 실패" });
  }

	  // 업로드된 파일 정보 출력
		console.log("업로드된 파일:", req.file);
})

router.post('/api/remove-profile', async (req, res) => {
	const memberId = req.session.user.id;
	const currentProfile = req.session.user.fileRename;

	try {
    // DB에 이미지 경로 저장
		const result = await removeProfile(memberId, currentProfile);
		if(result.success){
			// 세션에 즉시 수정
			req.session.user.filePath=`/static/img/member/user-thumbnail.png`;
			req.session.user.fileRename = null;
			// 클라이언트에 업로드된 파일 경로 응답
			res.json({
				success:true,
				message: '프로필 이미지가 성공적으로 업로드되었습니다.'
			});
		}else{
			res.json({
				success:false,
				message: '프로필 삭제 실패'
			});
		}

  } catch (error) {
    console.error("DB 삭제 오류:", error);
    res.status(500).json({ message: "DB 삭제 실패" });
  }


})


router.get('/logout', (req, res) => {
	// 세션 삭제 (로그아웃 처리)
	req.session.destroy(err => {
		if (err) {
				console.error('세션 삭제 오류:', err);
				return res.status(500).send('세션 파괴 실패');
		}
		
		res.redirect('/member/login'); // 로그인 페이지로 이동
	});
})



module.exports = router;
