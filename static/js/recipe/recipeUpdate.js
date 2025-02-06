document.addEventListener("DOMContentLoaded", function() {
    let stepCount = document.querySelectorAll(".step").length; // 초기 step 개수로 설정
    const stepsContainer = document.getElementById('steps-container');
    const addStepBtn = document.getElementById('add-step-btn');
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('recipe-form');
    const cancelBtn = document.getElementById('cancel-btn');

    // 썸네일 이미지 클릭 이벤트
    const thumbnailImg = document.getElementById('thumbnail-img');
    const thumbnailFile = document.getElementById('thumbnail-file');
    thumbnailImg.addEventListener('click', function() {
        thumbnailFile.click();
    });

    thumbnailFile.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                thumbnailImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Step 삭제 버튼 이벤트를 추가하는 함수
    function addDeleteStepEvent(stepElement) {
        const deleteBtn = stepElement.querySelector(".delete-step-btn");
        if (deleteBtn) { // deleteBtn이 있을 경우에만 이벤트 추가
            deleteBtn.addEventListener("click", function() {
                stepElement.classList.add('fade-out');
                setTimeout(() => {
                    // Step 삭제 후 번호 업데이트
                    stepElement.remove();
                    updateStepLabels();
                }, 400);
            });
        }
    }

    // Step 번호를 업데이트하는 함수
    function updateStepLabels() {
        const steps = document.querySelectorAll(".step");
        steps.forEach((step, index) => {
            const label = step.querySelector("label[for^='step']");
            label.textContent = `Step ${index + 1}`;
            step.id = `step${index + 1}`;
            const textarea = step.querySelector("textarea");
            textarea.id = `step${index + 1}-description`;
            textarea.name = `description[]`;
            const photoBoxDiv = step.querySelector("div[id^='step'][id$='-photoBox-div']");
            photoBoxDiv.id = `step${index + 1}-photoBox-div`;
            const img = step.querySelector("img");
            img.id = `step${index + 1}-photo`;
            const file = step.querySelector("input[type='file']");
            file.id = `step${index + 1}-photo-file`;
            file.name = `recipe_image_path[]`;
        });
        stepCount = steps.length;
    }

    // Step 이미지 클릭 이벤트 추가하는 함수
    function addStepImageClickEvent(stepNumber) {
        const stepPhoto = document.getElementById(`step${stepNumber}-photo`);
        const stepFile = document.getElementById(`step${stepNumber}-photo-file`);
        stepPhoto.addEventListener("click", function() {
            stepFile.click();
        });

        stepFile.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    stepPhoto.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 기존 step에 삭제 버튼 추가 및 이미지 클릭 이벤트 추가
    document.querySelectorAll(".step").forEach((step, index) => {
        if (index > 0) { // 첫 번째 step을 제외한 모든 step에 삭제 버튼 추가
            addDeleteStepEvent(step);
        }
        addStepImageClickEvent(index + 1);
    });

    // Step 추가 버튼 클릭 이벤트
    addStepBtn.addEventListener("click", function() {
        stepCount++;
        const newStep = document.createElement("div");
        newStep.classList.add("step");
        newStep.id = `step${stepCount}`;
        newStep.innerHTML = `
            <button type="button" class="delete-step-btn">x</button>
            <div class="form-group">
                <label for="step${stepCount}-description">Step ${stepCount}</label>
                <textarea id="step${stepCount}-description" name="description[]" placeholder="예) 다음 단계의 설명을 입력하세요." rows="5" required style="resize:none;"></textarea>
                <div class="form-group">
                    <div id="step${stepCount}-photoBox-div">
                        <img id="step${stepCount}-photo" src="https://recipe1.ezmember.co.kr/img/pic_none2.gif">
                        <input type="hidden" name="existingImage${stepCount}" value="">
                        <input type="file" id="step${stepCount}-photo-file" name="recipe_image_path[]" accept="image/*" style="display:none;">
                    </div>
                </div>
            </div>
        `;
        
        stepsContainer.insertBefore(newStep, addStepBtn);
        addDeleteStepEvent(newStep);
        addStepImageClickEvent(stepCount);
    });

    // 폼 제출 시 메시지 표시
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if(confirm("레시피 수정을 완료하시겠습니까?")) {
            const descriptions = document.querySelectorAll("textarea[name='description[]']");
            const imageInputs = document.querySelectorAll("input[name='recipe_image_path[]']");
            const existingThumbnail = document.querySelector("input[name='existingThumbnail']");
            const existingImages = document.querySelectorAll("input[name^='existingImage']");

            // 검증 로직 추가
            for (let i = 0; i < descriptions.length; i++) {
                if (!descriptions[i].value.trim()) {
                    alert("조리 순서를 입력해주세요.");
                    return;
                }
            }

            for (let i = 0; i < imageInputs.length; i++) {
                const imageInput = imageInputs[i];
                const existingImage = existingImages[i] ? existingImages[i].value : null;

                if (!imageInput.files.length && !existingImage) {
                    alert("조리 순서 이미지를 업로드해주세요.");
                    return;
                }
            }

            const formData = new FormData(form);

            // 기존 썸네일 추가
            if (existingThumbnail && existingThumbnail.value) {
                formData.append('existingThumbnail', existingThumbnail.value);
            }

            // 이미지 추가
            for (let i = 0; i < imageInputs.length; i++) {
                const imageInput = imageInputs[i];
                const existingImage = existingImages[i] ? existingImages[i].value : null;

                if (imageInput.files.length) {
                    // 새로운 이미지 파일이 있으면 추가
                    formData.append('recipe_image_path[]', imageInput.files[0]);
                } else if (existingImage) {
                    // 기존 이미지가 있으면 기존 이미지를 추가
                    formData.append('existingImage[]', existingImage);
                }
            }

            for (let pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]);
            }

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json().then(data => ({
                status: response.status,
                body: data  
            })))
            .then(({ status, body }) => {
                if (status === 200) {
                    alert(body.message);
                    window.location.href = '/recipe/myList';
                } else {
                    alert(body.message);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                alert('레시피 수정 중 오류가 발생했습니다.');
            })
        }
    });

    // 취소 클릭 시 이전 화면으로 이동
    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if(confirm('수정을 취소합니다.')) {
            history.back();
        }
    });
});
