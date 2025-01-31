document.addEventListener("DOMContentLoaded", function() {
    let stepCount = 1;
    const stepsContainer = document.getElementById("steps-container");
    const addStepBtn = document.getElementById("add-step-btn");

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
});