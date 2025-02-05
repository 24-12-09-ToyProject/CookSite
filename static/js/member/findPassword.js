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