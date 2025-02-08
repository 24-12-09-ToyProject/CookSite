const verifyEmailBtn = document.querySelector('#email-verify-btn');
const sendCodeBtn = document.querySelector('#send-code-btn');

// 버튼 활성화
function activateButton(btnName){
	if(btnName === 'verifyEmail'){
		verifyEmailBtn.classList.remove('disabled');
		verifyEmailBtn.onclick = verifyEmailCode;
	}
	if(btnName === 'sendCodeBtn'){
		sendCodeBtn.classList.remove('disabled');
		sendCodeBtn.onclick = sendEmailCode;
	}
}

// 버튼 비활성화
function deactivateButton(btnName){
	if(btnName === 'verifyEmail'){
		verifyEmailBtn.classList.add('disabled');
		verifyEmailBtn.onclick = null;
	}
	if(btnName === 'sendCodeBtn'){
		sendCodeBtn.classList.add('disabled');
		sendCodeBtn.onclick = null;
	}
}


const elMemberId = document.querySelector('#memberId');
	const elEmail = document.querySelector('#email');
	const elEmailDomain = document.querySelector('#email-domain');
	const findPwForm = document.querySelector('#find-password');

	// 페이지 로드 시 아이디 입력창 포커스
	elMemberId.focus();

	// 입력창에서 enter 가능
	document.querySelectorAll('#memberId, #email').forEach(input => {
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            findMemberPw();
        }
    });
	});


	async function findMemberPw(){
		if(elMemberId.value === ""){
			alert("아이디를 입력해주세요");
			elMemberId.focus();
			return;
		}
		
		// 이메일 필수입력 체크
		if(elEmail.value === ""){
			alert("이메일을 입력해주세요");
			elEmail.focus();
			return;
		}

		// 1. 아이디, 이메일 계정 존재하는 확인
		const response = await fetch('/member/api/find-pw', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ memberId:elMemberId.value, email:elEmail.value + elEmailDomain.value})
		});

		const result = await response.json();

		if (result.success) {
			Swal.fire({
					icon: 'success',
					title: '비밀번호 재설정 이메일 발송 완료',
					text: '입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해주세요.',
					confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
			});
		} else {
			Swal.fire({
					icon: 'warning',
					title: '계정 찾을 수 없음',
					text: '입력하신 정보와 해당하는 계정을 찾을 수 없습니다. 다시 확인해주세요.',
					confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
			});
		}
	}

