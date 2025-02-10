
const elMemberId = document.querySelector('#memberId');
const elMemberPw = document.querySelector('#memberPw');
const signinForm = document.querySelector('#signin-form');

if(signupResult === 'success'){
	Swal.fire({
		icon: 'success',
		title: '가입 완료!',
		text: '회원가입이 성공적으로 완료되었습니다.',
		confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
	}).then((result)=>{
		if(result.isConfirmed){
			// 아이디 입력창 포커스
			elMemberId.focus();
		}
	});
}else if(signupResult === 'fail'){
	Swal.fire({
		icon: 'warning',
		title: '가입이 완료되지 않았어요!',
		text: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
		confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
	}).then((result)=>{
		if(result.isConfirmed){
			// 아이디 입력창 포커스
			elMemberId.focus();
		}
	});
}else if(loggedInMessage === '로그아웃상태'){
	Swal.fire({
		icon: 'warning',
		title: '로그인이 필요합니다!',
		text: '로그인 후 이용해주세요.',
		confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
	}).then((result)=>{
		if(result.isConfirmed){
			// 아이디 입력창 포커스
			elMemberId.focus();
		}
	});
}else if(deleteResult === 'success'){
	Swal.fire({
		icon: 'success',
		title: '탈퇴가 완료되었습니다.',
		text: '그동안 이용해주셔서 감사합니다.',
		confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
	}).then((result)=>{
		if(result.isConfirmed){
			// 아이디 입력창 포커스
			elMemberId.focus();
		}
	});
}else if(loginResult === 'fail'){
	Swal.fire({
		icon: 'success',
		title: "로그인에 실패하였습니다.",
		text: "아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.",
		confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
	}).then((result)=>{
		if(result.isConfirmed){
			// 아이디 입력창 포커스
			elMemberId.focus();
		}
	});
}else{
	// 아이디 입력창 포커스
	elMemberId.focus();
}



function checkValidInput(){
	// id 필수입력 체크
	if(elMemberId.value === ""){
		alert("아이디를 입력해주세요");
		return;
	}
	
	// pw 필수입력 체크
	if(elMemberPw.value === ""){
		alert("비밀번호를 입력해주세요");
		return;
	}

	// 서버 검증
	signinForm.submit();
}

function signin(){
	checkValidInput();
}



// 아이디, 비밀번호 입력창에서 enter 누를 시 로그인실행
document.querySelectorAll("#memberId, #memberPw").forEach(input => {
	input.addEventListener("keypress", function(event) {
			if (event.key === "Enter") {
					event.preventDefault();
					document.getElementById("signin-btn").click();
			}
	});
});




function openNaverLogin(){
	const popup = window.open(
			api_url,  // 팝업에서 실행할 로그인 페이지
			'네이버 로그인',
			'width=500,height=600,top=100,left=100'
	);
}

// 팝업창 통해서 로그인 성공 후 값 변경 감지하여 페이지 이동
const parentEl = document.getElementById("parentEl");

// MutationObserver 설정
const observer = new MutationObserver(() => {
		console.log("Value changed:", parentEl.value);
		if (parentEl.value) {
				window.location.href = '/'; // 임시 (index파일 없음)
		}
});

// 감시할 대상과 설정 (value 변경 감지)
observer.observe(parentEl, { attributes: true, attributeFilter: ["value"] });


