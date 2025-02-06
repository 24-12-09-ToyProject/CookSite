// 버튼 상태 change
const editBtn = document.querySelectorAll('.edit-btn'); // 리스트 
const updateBtn = document.querySelectorAll('.update-btn');

function changeBtn(div, edit, update){
	const editBtn = document.querySelector('.' + edit);
	const updateBtn = document.querySelector('.' + update);

	if(div.classList.contains('edit-btn')){
		editBtn.classList.add('hide');
		updateBtn.classList.remove('hide');
	}else if(div.classList.contains('update-btn')){
		editBtn.classList.remove('hide');
		updateBtn.classList.add('hide');
	}
}

// 입력 가능하도록 변경해줌
function changeReadOnly(id, status){
	if(id === 'edit-phone' || id === 'update-phone'){
		const firstPhone = document.getElementById('first-phone');
		const secondPhone = document.getElementById('second-phone');

		if(status === 'add'){
			firstPhone.readOnly = true;
			secondPhone.readOnly = true;
		}else if(status === 'remove'){
			firstPhone.readOnly = false;
			secondPhone.readOnly = false;
		}
		return;
	}

	const idElement = document.getElementById(id);

	if(status === 'add'){
		idElement.readOnly = true;
	}else if(status === 'remove'){
		idElement.readOnly = false;
	}
}


// 이메일 select 박스 상태변경
function changeStatusSelect(status){
	const emailDomain = document.querySelector('#email-domain');
	emailDomain.disabled = status;
}


function openConfirmPwPage(){
	if(provider === 'naver'){
		
		return;
	}
	window.open("/member/confirmPassword?from=resetPw", "_blank", "noopener,noreferrer");
}

	
	// 렌더링 시 기존 데이터 세팅
	setInfo();
	function setInfo(){
		document.querySelector('#email').value = fullEmail.split('@')[0];
		document.querySelector('#first-phone').value = phone.split('-')[1];
		document.querySelector('#second-phone').value = phone.split('-')[2];
		const [year, month, day] = dateOfBirth.split(".").map(item => item.trim());
		document.querySelector('#year').value = year;
		document.querySelector('#month').value = month;
		document.querySelector('#day').value = day;

		if(gender === 'male'){
			document.querySelector('#male-radio').checked = true;
		}else if(gender === 'female'){
			document.querySelector('#female-radio').checked = true;
		}

		if(calendarType === 'solar'){
			document.querySelector('#solar-radio').checked = true;
		}else if(calendarType === 'lunar'){
			document.querySelector('#lunar-radio').checked = true;
		}

		const domain = fullEmail.split('@')[1];
		const emaildomainSelect = document.querySelector('#email-domain');

		for(let option of emaildomainSelect.options){
			if(option.value === `@${domain}`){
				option.selected = true;
				break;
			}
		}
	}


	// 데이터 변경 시 newData 클래스이름 등록
	function addNewData(div){
		if(div.id === 'address-search-btn'){
			return;
		}

		// 생년월일인경우 모두 newData 추가
		if(div.name === 'dateOfBirth'){
			document.querySelector('#year').classList.add('newData');
			document.querySelector('#month').classList.add('newData');
			document.querySelector('#day').classList.add('newData');
			return;
		}

		// phone인경우 모두 newData 추가
		if(div.name === 'phone'){
			document.querySelector('#first-phone').classList.add('newData');
			document.querySelector('#second-phone').classList.add('newData');
			return;
		}

		div.classList.add('newData');
		
	}

	// 빈 객체 생성
	const newDataObject = {};

	// newData 클래스이름 가진 값 객체에 추가
	function setNewData(){
		const newDatas = document.querySelectorAll('.newData');
		if(newDatas.length === 0){
			console.log("수정사항이 없음");
			
			return;
		}

		newDatas.forEach(item => {
			newDataObject[item.id] = item.value;
		})

		// 변경한 데이터 객체 출력
		console.log(newDataObject);


	}

	const fileInput = document.querySelector('#file-upload');

	// 데이터 유효성 검사
	function confirmRequired(){
		// 객체에 추가
		setNewData(); 
		if (Object.keys(newDataObject).length === 0 && !fileInput.classList.contains('newProfile') && !fileInput.classList.contains('removeProfile')) {
			console.log("수정사항이 없음");
			return;
		}

		let essenialArr = document.querySelectorAll('.required');

		const verified = document.querySelector('#email-verify-btn').getAttribute('data-emailVerified');

		// required 목록 공란 확인
		let noDataCount = 0;
			essenialArr.forEach(item => {
				if(item.value === ''){
					noDataCount++;
				}
			})

			if(noDataCount > 0){
				Swal.fire({
						icon: 'warning',
						title: '필수 입력란이 비어있어요!',
						text: '모든 필수 항목을 입력해주세요.',
						confirmButtonColor: '#555', // confrim 버튼 색깔 지정
					});
			}else if(verified === 'false'){
				Swal.fire({
						icon: 'warning',
						title: '이메일 인증이 완료되지 않았어요.',
						text: '이메일 인증을 먼저 해주세요.',
						confirmButtonColor: '#555', // confrim 버튼 색깔 지정
					});
			}else{
				const elForm = document.querySelector('#update-form');
				if(elForm.checkValidity()){
					// submit
					Swal.fire({
							icon: 'warning',
							title: '수정하시겠습니까?',
							text: '변경 내용을 저장하시려면 확인을 눌러주세요.',

							
							showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
							confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
							cancelButtonColor: '#555', // cancel 버튼 색깔 지정
							confirmButtonText: '확인', // confirm 버튼 텍스트 지정
							cancelButtonText: '취소', // cancel 버튼 텍스트 지정
							
							reverseButtons: true, // 버튼 순서 거꾸로
						}).then(async (result) => {
							if(result.isConfirmed){
								// 1. 이미지 업로드 - 수정사항없으면 return
								let result = await uploadProfileImage();

								// 2. 수정 요청 - 수정사항 없으면 return
								if(Object.keys(newDataObject).length === 0){
									console.log("2. 수정 요청 - 수정사항 없으면 return");
									
								}else{
										let response = await fetch('/member/api/update-info', {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify(newDataObject)
									});
	
									result = await response.json();
								}

								if(result.success){
									Swal.fire({
										icon: 'success',
										title: '회원정보 수정 완료',
										text: '회원정보가 성공적으로 변경되었습니다.',
										confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
									}).then(result => {
										if(result.isConfirmed){
											location.href="/member/detail";
										}
									})
								}else{
									Swal.fire({
										icon: 'warning',
										title: '수정 실패',
										text: '회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
										confirmButtonColor: '#555', // confrim 버튼 색깔 지정
									})
								}
							}
						})

				}else{
					Swal.fire({
							icon: 'warning',
							title: '입력 정보를 확인해주세요!',
							text: '생년월일, 휴대전화 또는 이메일이 올바르지 않습니다.',
						});
				}
			}
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

		// 이메일 인증요청 버튼
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

		// 이메일 변경 시 인증 상태 false로 변경
		function setEmailVerified(){
			const element = document.querySelector('#email-verify-btn');
			element.setAttribute('data-emailVerified', 'false');
		}




		// 이미지 업로드
		async function uploadProfileImage(){
			console.log("실행됨");
			
			// newProfile일 경우 프로필 추가
			if(fileInput.classList.contains('newProfile')){
				console.log("실행됨!!!");
				
				const file = fileInput.files[0];
				const formData = new FormData();
				formData.append("profileImage", file); // 파일 데이터를 FormData에 추가
		
				try {
					const response = await fetch('/member/api/upload-profile', {
						method: 'POST',
						body: formData, // FormData 객체 전송 (자동으로 Content-Type 설정됨)
					});

					const result = await response.json();

					if(result.success){
						return {success:true, message:"회원 정보 수정 성공"}
					}

					// 업로드된 이미지 미리보기 설정 -> db 들어가기 전 클라이언트에서 처리해야함
				// if (result.success){
				// 	document.querySelector('#imagePreview').src = result.filePath;
				// }

				} catch (error) {
					console.error("업로드 오류 : ", error);
					return;
				}
			}

			// removeProfile일 경우 프로필 제거
			if(fileInput.classList.contains('removeProfile')){
				console.log("removeProfile 실행");
				
				const response = await fetch('/member/api/remove-profile', {
					method: 'POST', 
				});

				const result = await response.json();

				if(result.success){
					return {success:true, message:"회원 정보 수정 성공"}
				}
			}

		}


		// 프로필 변경 시 newProfile 클래스명 추가
		function addUploadData(div){
			// naver일 경우 실행 X
			if(provider === 'naver'){
				Swal.fire({
						icon: 'warning',
						title: '변경 불가',
						text: '네이버에서 프로필 이미지를 변경해주세요',
						confirmButtonColor: '#555', // confrim 버튼 색깔 지정
					});
				
				return;
			}

			div.classList.remove('removeProfile');
			div.classList.add('newProfile');

			const file = div.files[0]; // 선택된 파일 가져오기

			if (file) {
					const reader = new FileReader();
					
					reader.onload = function (e) {
							document.getElementById("imagePreview").src = e.target.result; // 미리보기 업데이트
					};

					reader.readAsDataURL(file); // 파일을 읽어서 URL로 변환
			}
		}

		// 제거 버튼 누를 시 .removeProfile 추가
		function removeProfile(){
			if(provider === 'naver'){
				Swal.fire({
						icon: 'warning',
						title: '변경 불가',
						text: '네이버에서 프로필 이미지를 변경해주세요',
						confirmButtonColor: '#555', // confrim 버튼 색깔 지정
					});
				console.log("naver 이미지");
				
				return;
			}
			if(!document.querySelector('#imagePreview').src.includes('user-thumbnail')){
				fileInput.classList.remove('newProfile');
				fileInput.classList.add('removeProfile');
				document.querySelector('#imagePreview').src = "/static/img/member/user-thumbnail.png"; // 초기화
			}
		}
	
		// 회원 탈퇴
		function deleteAccount(){
			if(provider === 'naver'){
				Swal.fire({
							icon: 'warning',
							title: '회원 탈퇴',
							text: '소셜회원의 경우 확인버튼을 누를 시 즉시 탈퇴됩니다.',
							
							showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
							confirmButtonColor: '#800020', // confrim 버튼 색깔 지정
							cancelButtonColor: '#555', // cancel 버튼 색깔 지정
							confirmButtonText: '탈퇴하기', // confirm 버튼 텍스트 지정
							cancelButtonText: '취소', // cancel 버튼 텍스트 지정
							
							reverseButtons: true, // 버튼 순서 거꾸로
				}).then(result => {
					if(result.isConfirmed){
						location.href="/member/confirmPassword?from=deleteSocial";
					}
				})
			}else{
				
				location.href="/member/confirmPassword?from=deleteAccount";
			}
		}

		// 로그아웃
		function logout(){
			location.href="/member/logout";
		}