const express = require('express');
const naverRouter = express.Router();
const { findSnsMember, snsSignup, checkDuplicateEmail } = require('../../services/member/memberService.js')
const client_id = process.env.NAVER_ID;
const client_secret = process.env.NAVER_SECRET;
var redirectURI = encodeURI("http://127.0.0.1:8888/naver/callback");
var api_url = "";

naverRouter.get('/callback', async function (req, res) {
	console.log("콜백 실행");
	
	code = req.query.code;
	state = req.query.state;
	api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
		+ client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;

		const response = await fetch(api_url, {
			headers: {
				'X-Naver-Client-Id':client_id, 
				'X-Naver-Client-Secret': client_secret
			},
		});

		const tokenRequest = await response.json();

		// access_token으로 사용자 정보 받아오기
		if("access_token" in tokenRequest){
			const { access_token } = tokenRequest;
			const apiUrl = "https://openapi.naver.com/v1/nid/me";

			const data = await fetch(apiUrl, {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			});

			const userData = await data.json();
			
			// db에서 가입 확인
			const result = await findSnsMember(userData.response);

			if(result.success){
				// 로그인
				console.log(userData.response);
				

				// 세션 생성
				req.session.user = {
					id : result.info.member_id,
					filePath:result.info.profile_img,
					provider:'naver',
					loggedIn : true
				}


				res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
					res.end(`
						<script>
						if(${result.success}){
							const parentEl = opener.document.querySelector('#parentEl');
							parentEl.value = ${result.success};
							window.close();
						}
						</script>
						`);
				// res.json({success:true});
				
			}else{
				// 이메일 중복 체크
				const checkResult = await checkDuplicateEmail(userData.response.email);
				if(checkResult.success){
					// 회원가입 후 로그인
					const signupResult = await snsSignup(userData.response);
					if(signupResult.success){
						// 세션 생성
						req.session.user = {
							id : signupResult.info.memberId,
							filePath:signupResult.info.profileImg,
							provider:'naver',
							loggedIn : true
						}

						res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
						res.end(`
							<script>
							if(${signupResult.success}){
								const parentEl = opener.document.querySelector('#parentEl');
								parentEl.value = ${signupResult.success};
								window.close();
							}
							</script>
							`);
					}
				}else{
					res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
					res.end(`
						<script>
						alert('이미 일반 회원으로 가입된 이메일입니다.\\n일반 로그인을 이용해주세요.');
						window.close();
						
						</script>
					`);
				}
			}

			
		}else{
			res.send("오류 발생")
		}

});

module.exports = naverRouter;