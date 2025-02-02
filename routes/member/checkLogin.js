// 로그인 체크 미들웨어
function checkLogin(req, res, next) {
	if (req.session.user && req.session.user.loggedIn) {
		console.log("로그인 확인");
		
			next(); // 로그인된 경우
	} else {
		console.log("로그인 필요");
		req.flash('loggedInMessage', '로그아웃상태');
		res.redirect('/member/login');
	}
}

module.exports = {
	checkLogin
}