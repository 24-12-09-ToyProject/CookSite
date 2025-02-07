// 성공 메시지 정보 가져오기
let idSuccessMessage = document.querySelector('.id-notice.success-message');
let pwSuccessMessage = document.querySelector('.pw-notice.success-message');
// 실패 메시지 정보 가져오기 (글자수 제한)
let idFailureMessageLength = document.querySelector('.id-notice.failure-message-length');
let pwFailureMessageLength = document.querySelector('.pw-notice.failure-message-length');
// 실패 메시지2 정보 가져오기 (영어 또는 숫자)
let idFailureMessageType = document.querySelector('.id-notice.failure-message-type');
let pwFailureMessageType = document.querySelector('.pw-notice.failure-message-type');
// 실패 메시지3 정보 가져오기 (필수입력)
let idFailureMessageData = document.querySelector('.id-notice.failure-message-data');
let pwFailureMessageData = document.querySelector('.pw-notice.failure-message-data');
// 실패 메시지3 정보 가져오기 (중복된 아이디)
let idFailureMessageDuplicate = document.querySelector('.id-notice.faliure-message-duplicate');

// swal 알림창 함수
function showAlert(icon, title, text) {
	Swal.fire({
			icon: icon,
			title: title,
			text: text,
			confirmButtonColor: '#555'
	}).then(result=>{
		if(result.isConfirmed){
			 // 알림창이 닫히고 0.5초 후 스크롤 실행
			setTimeout(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
		}, 300); // 300ms 후 스크롤
			
		}
	})
	return;
}

// 길이 체크
function checkLength(idPw, value) {
	if(idPw === 'id'){
		return value.length >= 6 && value.length <= 12
	}else if(idPw === 'pw'){
		return value.length >= 8
	}
}

// 정규표현식 체크
function checkRegex(idPw, str) {
	// return /^[A-Za-z0-9][A-Za-z0-9]*$/.test(str);
	if(idPw === 'id'){
		return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z][a-zA-Z0-9]{3,11}$/.test(str);
	}else if(idPw === 'pw'){
		return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(str);
	}
}

// 값 공란 유무 확인
function checkEmpty (value) {
	return value !== '';
}

// 비밀번호 확인
function isMatch (password1, password2) {
	return password1 === password2;
}

// id, pw 유효성 체크 이벤트
function checkValid(idPw){
	// 아이디, 비밀번호 입력창 정보 가져오기
	let valMemberId = document.querySelector('#memberId').value;
	let valMemberPw = document.querySelector('#memberPw').value;

	if(idPw === 'id'){

		// id 수정 시 중복체크 결과 초기화
		duplicateCheckBtn.setAttribute('data-valid', 'false');

		if(!checkEmpty(valMemberId)){
			idSuccessMessage.classList.add('hide');
			idFailureMessageLength.classList.add('hide');
			idFailureMessageType.classList.add('hide');
			idFailureMessageData.classList.remove('hide');
			idFailureMessageDuplicate.classList.add('hide');
			// 유효성 체크 후 중복체크 버튼 비활성화
			deactivateButton('checkDuplicate');
		}else if(!checkLength('id', valMemberId)){
			idSuccessMessage.classList.add('hide');
			idFailureMessageLength.classList.remove('hide');
			idFailureMessageType.classList.add('hide');
			idFailureMessageData.classList.add('hide');
			idFailureMessageDuplicate.classList.add('hide');
			// 유효성 체크 후 중복체크 버튼 비활성화
			deactivateButton('checkDuplicate');
		}else if(!checkRegex('id', valMemberId)){
			idSuccessMessage.classList.add('hide');
			idFailureMessageLength.classList.add('hide');
			idFailureMessageType.classList.remove('hide');
			idFailureMessageData.classList.add('hide');
			idFailureMessageDuplicate.classList.add('hide');
			// 유효성 체크 후 중복체크 버튼 비활성화
			deactivateButton('checkDuplicate');
		}else{
			// 성공
			idSuccessMessage.classList.remove('hide');
			idFailureMessageLength.classList.add('hide');
			idFailureMessageType.classList.add('hide');
			idFailureMessageData.classList.add('hide');
			idFailureMessageDuplicate.classList.add('hide');

			// 유효성 체크 후 중복체크 버튼 활성화
			activateButton('checkDuplicate');
		}
	}else if(idPw === 'pw'){
		if(!checkEmpty(valMemberPw)){
			pwSuccessMessage.classList.add('hide');
			pwFailureMessageLength.classList.add('hide');
			pwFailureMessageType.classList.add('hide');
			pwFailureMessageData.classList.remove('hide');
		}else if(!checkLength('pw', valMemberPw)){
			pwSuccessMessage.classList.add('hide');
			pwFailureMessageLength.classList.remove('hide');
			pwFailureMessageType.classList.add('hide');
			pwFailureMessageData.classList.add('hide');
		}else if(!checkRegex('pw', valMemberPw)){
			pwSuccessMessage.classList.add('hide');
			pwFailureMessageLength.classList.add('hide');
			pwFailureMessageType.classList.remove('hide');
			pwFailureMessageData.classList.add('hide');
		}else{
			pwSuccessMessage.classList.remove('hide');
			pwFailureMessageLength.classList.add('hide');
			pwFailureMessageType.classList.add('hide');
			pwFailureMessageData.classList.add('hide');
		}
	}
	
}

// 비밀번호 확인 정보 가져오기
let elEmptyMessage = document.querySelector('.confirm-notice.failure-message-data');
let elMismatchMessage = document.querySelector('.confirm-notice.failure-message-mismatch');
let elMatchSuccessMessage = document.querySelector('.confirm-notice.success-message');

// pw 확인 
function checkPasswordRetype(){
	let elInputPasswordRetype = document.querySelector('#confirmPw').value;
	let valMemberPw = document.querySelector('#memberPw').value;
	
	if(elInputPasswordRetype === ''){
		elEmptyMessage.classList.remove('hide');
		elMismatchMessage.classList.add('hide');
		elMatchSuccessMessage.classList.add('hide');
		return;
	}

	if(!elInputPasswordRetype === ''){
		elEmptyMessage.classList.remove('hide');
		elMismatchMessage.classList.add('hide');
		elMatchSuccessMessage.classList.add('hide');
	}else if(!isMatch(valMemberPw, elInputPasswordRetype)){
		elEmptyMessage.classList.add('hide');
		elMismatchMessage.classList.remove('hide');
		elMatchSuccessMessage.classList.add('hide');
	}else{
		elEmptyMessage.classList.add('hide');
		elMismatchMessage.classList.add('hide');
		elMatchSuccessMessage.classList.remove('hide');
	}
}

// 최종 검사
function finalSignUp(){
	let elForm = document.querySelector('#signUp-form');
	let el = document.querySelectorAll('.success-message');
	let essenialArr = document.querySelectorAll('.required');

	// required 목록 공란 확인
	let noDataCount = 0;
	essenialArr.forEach(item => {
		if(item.value === ''){
			noDataCount++;
		}
	})
	
	// 유효성 검사 성공 유무 확인
	let count = 0;
	el.forEach(item => {
		if(item.classList.contains("hide")){
			count++;
		}
		
	})

	// 아이디 중복확인 
	let isValid =	duplicateCheckBtn.getAttribute('data-valid');
	let isEmailVerified = elEmailCodeBtn.getAttribute('data-emailVerified');	

	// 공란 highlight 처리
	showEmptyFieldWarnings();
	
	if (noDataCount > 0) {
    showAlert('warning', '필수 입력란이 비어있어요!', '모든 필수 항목을 입력해주세요.');
		return;
	} else if (count > 0) {
			showAlert('warning', '아이디 / 비밀번호를 확인해주세요!', '입력하신 정보를 다시 확인해주세요.');
			return;
	} else if (isValid === 'false') {
			showAlert('warning', '아이디 중복 확인이 필요합니다.', '아이디를 확인 후 다시 시도해주세요.');
			return;
	} else if (isEmailVerified === 'false') {
			showAlert('warning', '이메일 인증이 완료되지 않았어요.', '이메일 인증을 먼저 해주세요.');
			return;
	}else{
		
			
			// html 기본 유효성검사 통과 시 submit
			if(elForm.checkValidity()){
				Swal.fire({
					title: '회원가입을 진행하시겠습니까?',
					text: '입력한 정보가 최종 확인됩니다. 다시 확인하시고 진행해주세요.',
					icon: 'question',
					
					showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
					confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
					cancelButtonColor: '#555', // cancel 버튼 색깔 지정
					confirmButtonText: '확인', // confirm 버튼 텍스트 지정
					cancelButtonText: '취소', // cancel 버튼 텍스트 지정
					
					reverseButtons: true, // 버튼 순서 거꾸로
					
				}).then(result => {
					// 만약 Promise리턴을 받으면,
					if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면


						let timerInterval;
						Swal.fire({
							title: "가입이 진행됩니다!",
							html: "잠시만 기다려주세요. <b></b> ms",
							timer: 700,
							timerProgressBar: true,
							didOpen: () => {
								Swal.showLoading();
								const timer = Swal.getPopup().querySelector("b");
								timerInterval = setInterval(() => {
									timer.textContent = `${Swal.getTimerLeft()}`;
								}, 100);
							},
							willClose: () => {
								clearInterval(timerInterval);
							}
						}).then((result) => {
							/* Read more about handling dismissals below */
							if (result.dismiss === Swal.DismissReason.timer) {
								console.log("I was closed by the timer");
								elForm.submit(); // 폼 제출
							}
						});

					}
				});
			}else{
				Swal.fire({
					icon: 'warning',
					title: '입력 정보를 확인해주세요!',
					text: '생년월일, 휴대전화 또는 이메일이 올바르지 않습니다.',
					confirmButtonColor: '#555', // confrim 버튼 색깔 지정
				});

				const invalidElements = elForm.querySelectorAll(':invalid');
				const validElements = elForm.querySelectorAll(':valid');

				invalidElements.forEach(item => {
					console.log(item);  // 유효성 검사에 실패한 요소들을 출력
					item.style.borderColor = 'red';  // 실패한 입력 요소를 빨간색으로 표시
					item.style.borderWidth = '2px';
				});

			}
	}

	
}

// 필수 입력란 공란일 시 input css 적용
function showEmptyFieldWarnings(){
	let el = document.querySelectorAll('.required');
	console.log(el);
	
	el.forEach(item => {
		if(item.value === ''){
			item.style.borderColor = 'red';
			item.style.borderWidth = '2px';
		}else{
			item.style.borderColor = '#e9e9e9';
			item.style.borderWidth = '1px';
		}
	})

	
}




// 아이디 중복 체크 버튼, 이메일 인증요청 버튼
const duplicateCheckBtn = document.querySelector('#check-duplicate-btn');
const verifyEmailBtn = document.querySelector('#email-verify-btn');
const sendCodeBtn = document.querySelector('#send-code-btn');

// 버튼 활성화
function activateButton(btnName){
	if(btnName === 'checkDuplicate'){
		duplicateCheckBtn.classList.remove('disabled');
		duplicateCheckBtn.onclick = checkDuplicate;
	}

	if(btnName === 'verifyEmail'){
		verifyEmailBtn.classList.remove('disabled');
		verifyEmailBtn.onclick = verifyEmailCode;
	}

	if(btnName === 'sendCodeBtn'){
		sendCodeBtn.classList.remove('disabled');
		sendCodeBtn.onclick = () => sendEmailCode('register');
	}
}

// 버튼 비활성화
function deactivateButton(btnName){
	if(btnName === 'checkDuplicate'){
		duplicateCheckBtn.classList.add('disabled');
		duplicateCheckBtn.onclick = null;
	}

	if(btnName === 'verifyEmail'){
		verifyEmailBtn.classList.add('disabled');
		verifyEmailBtn.onclick = null;
	}

	if(btnName === 'sendCodeBtn'){
		sendCodeBtn.classList.add('disabled');
		sendCodeBtn.onclick = null;
	}
}



// onclick 핸들러 - ajax 비동기통신
function checkDuplicate() {
	(async () => {
		const memberId = document.querySelector('#memberId').value;

		// 중복 확인 요청
		const response = await fetch('/member/api/check-duplicate-id', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ memberId })
		});

		if (!response.ok) {
				console.log(response.status);
				
		}

		const result = await response.json();

		console.log(result);
		

		if (result.success) {
			Swal.fire({
					icon: 'success',
					title: '사용 가능한 아이디입니다!',
					text: '해당 아이디를 사용할 수 있습니다.',
					confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
			});
			// 중복확인 - data-valid : true 로 변경
			duplicateCheckBtn.setAttribute('data-valid', 'true');
			
		} else {
			Swal.fire({
					icon: 'warning',
					title: '아이디 중복!',
					text: '이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.',
					confirmButtonColor: '#555', // confrim 버튼 색깔 지정
			});
			idSuccessMessage.classList.add('hide');
			idFailureMessageDuplicate.classList.remove('hide');

			// 중복확인 - data-valid : false 로 변경
			duplicateCheckBtn.setAttribute('data-valid', 'false');
		}
	})();


}



// 이메일 공란 체크
function checkEmailRequired() {
	let email = document.querySelector('#email').value;

	if(email === ''){
		deactivateButton('sendCodeBtn');
	}else{
		activateButton('sendCodeBtn');
	}
}

