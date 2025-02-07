const email = document.querySelector('#email');
const emailDomain = document.querySelector('#email-domain');
const elEmailCode = document.querySelector('#email-code');
const elEmailCodeBtn = document.querySelector('#email-verify-btn');

// 이메일 코드 전송
async	function sendEmailCode(){
	const response = await fetch('/member/api/send-email', {
		method: 'POST',
			headers: {
					'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email:email.value, emailDomain:emailDomain.value }),
	});

	const data = await response.json();

	console.log("data : "+data);

	if(data.success){
		console.log("성공");
		
		alert('이메일로 코드가 전송되었습니다');
		const elMailCode = document.querySelector('#email-code');
		startTimer(); // 1분 타이머 시작
		// 제한시간 1분 스타트
		window.setTimeout(()=>{
			deactivateButton('verifyEmail'); // 이메일 인증 버튼 비활성화
			elMailCode.disabled = true;			// 이메일 인증코드 입력창 비활성화
		}, 1000 * 60) // 60초

		activateButton('verifyEmail');
		elMailCode.disabled = false;

	}else{
		console.log("실패");
		
	}

}

// 이메일 코드 인증 
async	function verifyEmailCode(){
	const emailAddress = `${email.value}${emailDomain.value}`;
	const response = await fetch('/member/api/verify-emailCode', {
		method: 'POST',
			headers: {
					'Content-Type': 'application/json',
			},
			body: JSON.stringify({ emailCode:elEmailCode.value, email:emailAddress }),
	});

	const result = await response.json();

	console.log("result : " + result);

	if(result.success){
		Swal.fire({
					icon: 'success',
					title: '이메일 인증 완료!',
					text: '이메일 인증이 성공적으로 완료되었습니다.',
					confirmButtonColor: '#800020'
		});
		elEmailCodeBtn.setAttribute('data-emailVerified', 'true');
		clearInterval(timer);
		document.querySelector("#timer").style.display='none';
		deactivateButton('verifyEmail'); // 이메일 인증 버튼 비활성화
		elEmailCode.disabled = true;			// 이메일 인증코드 입력창 비활성화
		
	}else{
		Swal.fire({
					icon: 'warning',
					title: '이메일 인증 실패!',
					html: '인증 코드가 올바르지 않습니다.<br>다시 입력하거나 새로운 인증 코드를 요청해주세요.',
					confirmButtonColor: '#555'
		});
		elEmailCodeBtn.setAttribute('data-emailVerifed', 'false');
	}

}