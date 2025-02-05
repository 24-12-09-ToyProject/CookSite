document.addEventListener("DOMContentLoaded", function() {
    let stepCount = 1;
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
        deleteBtn.addEventListener("click", function() {
            stepElement.classList.add('fade-out');
            setTimeout(() => {
                // Step 삭제 후 번호 업데이트
                stepElement.remove();
                updateStepLabels();
            }, 400);
        });
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
                        <input type="file" id="step${stepCount}-photo-file" name="recipe_image_path[]" accept="image/*" style="display:none;">
                    </div>
                </div>
            </div>
        `;
        
        stepsContainer.insertBefore(newStep, addStepBtn);
        addDeleteStepEvent(newStep);
        addStepImageClickEvent(stepCount);
    });
    addStepImageClickEvent(1);

    // 폼 제출 시 메시지 표시
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const descriptions = document.querySelectorAll("textarea[name='description[]']");
        const photos = document.querySelectorAll("input[name='recipe_image_path[]']");
        for (let i = 0; i < descriptions.length; i++) {
            if (!descriptions[i].value.trim() || !photos[i].files.length) {
                alert("조리 순서와 이미지를 모두 입력해주세요.");
                return;
            }
        }

        if(confirm("레시피를 등록하시겠습니까? 등록된 레시피는 나의 레시피에서 확인할 수 있습니다.")) {
            submitBtn.disabled = true;
            const formData = new FormData(form);
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
                    window.location.href = '/recipe/list';
                } else {
                    alert(body.message);
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                alert('레시피 등록 중 오류가 발생했습니다.');
                submitBtn.disabled = false;
            })
        }
    });

    // 취소 클릭 시 이전 화면으로 이동
    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if(confirm('등록을 취소합니다.')) {
            history.back();
        }
    })

});