// 모든 "options" 컨테이너에 클릭 이벤트 추가
document.querySelectorAll(".options").forEach((optionsContainer) => {
    optionsContainer.addEventListener("click", (event) => {
        const clickedOption = event.target;

        // 클릭한 요소가 "option" 클래스인지 확인
        if (clickedOption.classList.contains("option")) {
            // 같은 그룹의 모든 옵션에서 active 클래스 제거
            optionsContainer.querySelectorAll(".option").forEach((option) => {
                option.classList.remove("active");
            });

            // 클릭한 요소에 active 클래스 추가
            clickedOption.classList.add("active");
        }
    });
});
function showStep(stepNumber) {
    const steps = document.querySelectorAll(".step");
    const buttons = document.querySelectorAll(".buttons")
    buttons.forEach((button) =>{
        button.classList.add("hidden");
    } )
    steps.forEach((step) => {
        step.classList.add("hidden");
    });
    document.getElementById(`step-${stepNumber}`).classList.remove("hidden");
}

// 사진 업로드 미리보기 
document.querySelectorAll(".image-upload-container").forEach((container) => {
    const input = container.querySelector(".hidden-input"); // 해당 컨테이너의 파일 입력
    const uploadBox = container.querySelector(".image-upload-box");

    input.addEventListener("change", (event) => {
        const file = event.target.files[0]; // 첫 번째 파일만 처리
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // 기존 업로드 박스 숨기기
                uploadBox.style.display = "none";

                // 업로드된 이미지 표시
                const uploadedImage = document.createElement("img");
                uploadedImage.src = e.target.result;
                uploadedImage.classList.add("uploaded-image");

                // 기존 이미지를 지우고 새로운 이미지 추가
                container.appendChild(uploadedImage);
            };
            reader.readAsDataURL(file); // 파일을 base64 URL로 읽기
        }
    });
});
