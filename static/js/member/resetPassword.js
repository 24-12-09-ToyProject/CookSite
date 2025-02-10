const elMemberId = document.querySelector('#memberId');
const elMemberPw = document.querySelector('#memberPw');

// 비밀번호 입력창 포커스
elMemberPw.focus();

// 입력창에서 enter 가능
document.querySelectorAll('#confirmPw, #memberPw').forEach(input => {
	input.addEventListener("keypress", function(event) {
			if (event.key === "Enter") {
					event.preventDefault();
					resetPassword();
			}
	});
});


if(decodedMemberId !== ""){
	document.querySelector('#memberId').value = decodedMemberId;
}

// 비밀번호 재설정
async function resetPassword(){
	let el = document.querySelectorAll('.success-message');

	let count = 0;
	
	el.forEach(item => {
		if(item.classList.contains("hide")){
			count++;
		}
	})

	if(count > 0){
		alert("입력된 정보를 확인해주세요");

		return;
	}

	Swal.fire({
		title: '비밀번호를 재설정하시겠습니까?',
		text: '변경 후 이전 비밀번호로는 로그인할 수 없습니다. 신중하게 진행해주세요.',
		icon: 'warning',
		
		showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
		confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
		cancelButtonColor: '#555', // cancel 버튼 색깔 지정
		confirmButtonText: '확인', // confirm 버튼 텍스트 지정
		cancelButtonText: '취소', // cancel 버튼 텍스트 지정
		
		reverseButtons: true, // 버튼 순서 거꾸로
		
	})
	.then(result => {
		// 만약 Promise리턴을 받으면,
		if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
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
			})
			.then(async (result) => {
				// 확인 버튼 클릭 후 동작
				if (result.dismiss === Swal.DismissReason.timer) {
					// 비밀번호 재설정 api 실행
					const response = await fetch('/member/api/reset-password', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ memberId : elMemberId.value, memberPw : elMemberPw.value })
					});

					const result = await response.json();

					if(result.success){
						Swal.fire({
							icon: 'success',
							title: '비밀번호 재설정 완료',
							text: '새로운 비밀번호로 로그인해 주세요.',
							confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
						}).then((result)=>{
							if(result.isConfirmed){
								// 성공 시 로그아웃 후 login페이지 이동
								location.href = `/member/logout`;
							}
						});
						return;
					}else{
						Swal.fire({
							icon: 'warning',
							title: '비밀번호 재설정 불가',
							text: '존재하는 비밀번호입니다.',
							confirmButtonColor: '#555', // confrim 버튼 색깔 지정
						}).then(result => {
							if(result.isConfirmed){
								// 비밀번호 입력창 포커스
								elMemberPw.focus();
							}
						})
						
						return;
					}

				}
			});
		}
	});

	
}




// 성공 메시지 정보 가져오기
let pwSuccessMessage = document.querySelector('.pw-notice.success-message');
// 실패 메시지 정보 가져오기 (글자수 제한)
let pwFailureMessageLength = document.querySelector('.pw-notice.failure-message-length');
// 실패 메시지2 정보 가져오기 (영어 또는 숫자)
let pwFailureMessageType = document.querySelector('.pw-notice.failure-message-type');
// 실패 메시지3 정보 가져오기 (필수입력)
let pwFailureMessageData = document.querySelector('.pw-notice.failure-message-data');

// 길이 체크
function checkLength(value) {
	return value.length >= 8
}

// 값 공란 유무 확인
function checkEmpty (value) {
	return value !== '';
}

// 정규표현식 체크
function checkRegex(pw) {
	return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(pw);
}

// 비밀번호 확인
function isMatch (password1, password2) {
	return password1 === password2;
}

// pw 유효성 체크 이벤트
function checkValid(){
	// 아이디, 비밀번호 입력창 정보 가져오기
	let valMemberId = document.querySelector('#memberId').value;
	let valMemberPw = document.querySelector('#memberPw').value;

	if(!checkEmpty(valMemberPw)){
		pwSuccessMessage.classList.add('hide');
		pwFailureMessageLength.classList.add('hide');
		pwFailureMessageType.classList.add('hide');
		pwFailureMessageData.classList.remove('hide');
	}else if(!checkLength(valMemberPw)){
		pwSuccessMessage.classList.add('hide');
		pwFailureMessageLength.classList.remove('hide');
		pwFailureMessageType.classList.add('hide');
		pwFailureMessageData.classList.add('hide');
	}else if(!checkRegex(valMemberPw)){
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
