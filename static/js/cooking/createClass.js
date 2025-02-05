

// 모든 "options" 컨테이너에 클릭 이벤트 추가
document.querySelectorAll(".options").forEach((optionsContainer) => {
    optionsContainer.addEventListener("click", (event) => {
        const clickedOption = event.target;

        if (clickedOption.classList.contains("option")) {
            // "option" 클릭 처리
            optionsContainer.querySelectorAll(".option").forEach((option) => {
                option.classList.remove("active");
            });
            clickedOption.classList.add("active");

            // Step1Data 업데이트
            if (optionsContainer.querySelector(".option.active")) {
                step1Data.classType = clickedOption.textContent.trim();
            }
        } else if (clickedOption.classList.contains("classFrequency")) {
            // "classFrequency" 클릭 처리
            optionsContainer.querySelectorAll(".classFrequency").forEach((frequency) => {
                frequency.classList.remove("active");
            });
            clickedOption.classList.add("active");

            // Step1Data 업데이트
            if (optionsContainer.querySelector(".classFrequency.active")) {
                step1Data.classFrequency = clickedOption.textContent.trim();
            }
        }

        console.log("현재 Step 1 데이터:", step1Data); // 디버깅용
    });
});
// 사이드 바 목록 위치 체크
document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".sidebar-step");
    const nextButton = document.querySelectorAll(".next");
    let currentStep = 0;

    nextButton.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
            // 현재 항목에서 active 클래스 제거
            steps[currentStep].classList.remove("active");

            // 다음 항목에 active 클래스 추가
            currentStep += 1;
            steps[currentStep].classList.add("active");
        }
    });
});
// 다음 클릭 시 번호 이동
function showStep(stepNumber) {
    const steps = document.querySelectorAll(".step");
    const buttons = document.querySelectorAll(".buttons")

    // 모든 사이드바 항목에서 BOLD 제거
    document.querySelectorAll(".sidebar-step").forEach((sidebarStep) => {
        sidebarStep.style.fontWeight = "normal";
        sidebarStep.style.color = "black";
    });

    // 현재 스텝에 맞는 사이드바 항목에 BOLD 추가
    let activeSidebarStep;
    if (stepNumber === 1 || stepNumber === 2) {
        activeSidebarStep = document.getElementById("sidebar-step1");
    } else if (stepNumber === 3 || stepNumber === 4) {
        activeSidebarStep = document.getElementById("sidebar-step2");
    } else {
        activeSidebarStep = document.getElementById("sidebar-step3");
    }

    if (activeSidebarStep) {
        activeSidebarStep.style.fontWeight = "bold";
        activeSidebarStep.style.backgroundColor = "#ffe4c4"; // 강조 색상 변경 가능
    }
    buttons.forEach((button) =>{
        button.classList.add("hidden");
    } )

    steps.forEach((step) => {
        step.classList.add("hidden");
    });
    document.getElementById(`step-${stepNumber}`).classList.remove("hidden");
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
    showStep(1);
});

// 대표 및 클래스 내용 이미지 관련 요소
const photoContainers = [
    {
        container: document.getElementById("upload-class-photo-container"),
        input: document.getElementById("upload-class-photo-input"),
        preview: document.getElementById("class-photo-preview"),
        isRequired: true,
    },
    {
        container: document.getElementById("upload-class-content-container"),
        input: document.getElementById("upload-class-content-input"),
        preview: document.getElementById("image-preview-wrapper"),
        isRequired: false,
    },
];

// 공통: 파일 업로드 처리
async function uploadFile(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            const encodedUrl = encodeURI(result.url); // URL에 문제가 있을 경우 추가적으로 인코딩

            return encodedUrl;
        } else {
            console.error("업로드 실패:", await response.text());
            throw new Error("업로드 실패");
        }
    } catch (error) {
        console.error("업로드 중 에러 발생:", error);
        throw error;
    }
}

let isUploading = false;
// 이미지 업로드 및 미리보기 처리
let classImages = []; // 전역 배열, 모든 클래스 이미지 URL을 저장

async function handleImageUpload(containerConfig) {
    const { input, preview, isRequired } = containerConfig;
    const files = Array.from(input.files);

    if (files.length === 0 && isRequired) {
        alert("필수 이미지를 업로드해야 합니다!");
        return;
    }

    isUploading = true; // 업로드 시작

    if (preview.id === "class-photo-preview") {
        const file = files[0]; // 대표 이미지는 하나만 처리
        const localUrl = URL.createObjectURL(file);
        preview.src = localUrl; // 로컬 미리보기 업데이트

        try {
            const uploadedUrl = await uploadFile(file);
            preview.src = uploadedUrl; // 업로드된 URL로 변경
            console.log(`📌 업로드된 대표 이미지 URL: ${uploadedUrl}`);
        } catch (error) {
            console.error("🚨 대표 이미지 업로드 중 오류:", error);
        }
    }

    if (preview.id === "image-preview-wrapper") {
        const container = preview.parentNode;

        await Promise.all(
            files.map(async (file) => {
                const previewWrapper = document.createElement("div");
                previewWrapper.className = "image-preview-wrapper";
                previewWrapper.style.marginTop = "10px";
                previewWrapper.style.width = "200px";
                previewWrapper.style.height = "100px";
                previewWrapper.style.borderRadius = "10px";

                const newImg = document.createElement("img");
                newImg.src = URL.createObjectURL(file);
                newImg.alt = "업로드된 클래스 이미지";
                newImg.className = "preview-image";

                previewWrapper.appendChild(newImg);
                container.insertBefore(previewWrapper, preview);

                try {
                    const uploadedUrl = await uploadFile(file);
                    newImg.src = uploadedUrl; // 업로드된 URL로 변경
                    classImages.push(uploadedUrl); // 배열에 추가
                    console.log(`📌 업로드된 클래스 이미지 URL: ${uploadedUrl}`);
                } catch (error) {
                    console.error("🚨 클래스 이미지 업로드 중 오류:", error);
                }
            })
        );
    }

    isUploading = false; // 업로드 완료
    console.log("📌 최종 업로드된 classImages 배열:", classImages);
}



// // 파일 선택 후 이미지 업로드 및 미리보기 업데이트
// async function handleFileUpload(input, previewElement) {
//     const files = Array.from(input.files); // 다중 파일 처리
//     if (files.length === 0) return;

//     // 미리보기 영역 초기화
//     previewElement.innerHTML = "";

//     for (const file of files) {
//         // 1. 로컬 미리보기 생성
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             previewElement.src = event.target.result; // 로컬 파일 URL
//         };
//         reader.readAsDataURL(file); // 파일을 데이터 URL로 변환

//         // 2. 파일 업로드
//         try {
//             const uploadedUrl = await uploadFile(file); // 파일 업로드
//             previewElement.src = uploadedUrl; // 업로드된 GCS URL로 업데이트
//         } catch (error) {
//             console.error("업로드 중 오류:", error);
//         }
//     }

    // const file = input.files[0];
    // if (file) {
    //     // 1. 로컬 미리보기 표시
    //     const blobUrl = URL.createObjectURL(file);
    //     previewElement.src = blobUrl;

    //     // 2. 파일 업로드
    //     try {
    //         const uploadedUrl = await uploadFile(file); // 파일 업로드
    //         previewElement.src = uploadedUrl; // 업로드된 GCS URL로 업데이트
    //     } catch (error) {
    //         console.error("업로드 중 오류:", error);
    //     }
    // }


// // 모든 컨테이너에 클릭 및 파일 업로드 이벤트 추가
// photoContainers.forEach(({ container, input, preview }) => {
//     if (!container || !input || !preview) {
//         console.error("필수 DOM 요소가 정의되지 않았습니다.");
//         return;
//     }
//     // 클릭 시 파일 선택 창 열기
//     container.addEventListener("click", () => input.click());

//     // 파일 선택 후 처리
//     input.removeEventListener("change", handleFileUpload);
//     input.addEventListener("change", () => handleFileUpload(input, preview));
// });
// 모든 컨테이너에 클릭 및 파일 업로드 이벤트 추가
photoContainers.forEach((containerConfig) => {
    const { container, input } = containerConfig;

    if (!container || !input) {
        console.error("필수 DOM 요소가 정의되지 않았습니다.");
        return;
    }

    // 클릭 시 파일 선택 창 열기
    container.addEventListener("click", () => input.click());

    // 파일 선택 후 처리
    input.addEventListener("change", () => handleImageUpload(containerConfig));
});
//글쓰기 에디터 api 
const contentEditor = new toastui.Editor({
    el: document.querySelector('.quiz-content'),
    height: '700px',
    initialEditType: 'markdown',
    initialValue: quizContent,
    previewStyle: 'vertical',
    placeholder: '클래스 소개내용을 적어주세요.',
    hooks: {
        addImageBlobHook: async (blob, callback) => {
        const base64Image = await resizeAndCompressImage(blob);
          callback(base64Image, 'alt text'); // 압축된 Base64 데이터를 삽입
        },
    }
});
function resizeAndCompressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
        img.src = event.target.result;
    };

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const base64Image = canvas.toDataURL('image/jpeg', quality);
        resolve(base64Image);
    };

    reader.readAsDataURL(file);
    });
}


// step - 5
// 난이도 버튼 클릭 처리
document.querySelectorAll('.difficulty-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach((btn) => btn.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// 커리큘럼 텍스트 길이 카운트
const textarea = document.getElementById('curriculum-description');
const charCount = textarea.nextElementSibling;

textarea.addEventListener('input', () => {
    const currentLength = textarea.value.length;
    charCount.textContent = `최소 40자 이상 (${currentLength}/600)`;
});

const className = document.getElementById('className');
const textCount = className.nextElementSibling;

className.addEventListener('input', ()=>{
    const textLength = className.value.length;
    textCount.textContent = `최대 50글자 (${textLength}/50)`;
})

// 강사 사진 업로드 미리보기
// HTML 요소 가져오기
const uploadPhotoBtn = document.getElementById('upload-photo-btn'); // "사진 등록" 버튼
const uploadPhotoInput = document.getElementById('upload-photo-input'); // 숨겨진 파일 입력
const photoPreview = document.getElementById('photo-preview'); // 미리보기 이미지

// "사진 등록" 버튼 클릭 시 파일 선택 창 열기
uploadPhotoBtn.addEventListener('click', () => {
    uploadPhotoInput.click(); // 숨겨진 input 파일 입력을 강제로 클릭
});
// 파일 선택 후 미리보기 이미지 업데이트
uploadPhotoInput.addEventListener("change", async (event) => {
    const file = event.target.files[0]; // 사용자가 선택한 파일
    if (file) {
        // 서버로 파일 업로드 요청
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                const gcsUrl = result.url; // 서버에서 반환한 GCS URL

                // 업로드된 이미지를 미리보기로 표시
                photoPreview.src = gcsUrl;
            } else {
                console.error("이미지 업로드 실패:", await response.text());
            }
        } catch (error) {
            console.error("업로드 중 에러 발생:", error);
        }
    }
});
// 설명 칸 수 업데이트

const instructortext = document.getElementById("instructor-description");
const instructortextCount = instructortext.nextElementSibling;
const nicknametext = document.getElementById("nickname");
const nicknametextCount = nicknametext.nextElementSibling;
nicknametext.addEventListener('input',()=>{
    const currentLength = nicknametext.value.length;
    nicknametextCount.textContent = `최대 15글자 (${currentLength}/15)`;
})
instructortext.addEventListener('input',()=>{
    const currentLength = instructortext.value.length;
    instructortextCount.textContent = `최대 600자 (${currentLength}/600)`;
});


// // 파일 선택 후 미리보기 이미지 업데이트
// uploadPhotoInput.addEventListener('change', (event) => {
//     const file = event.target.files[0]; // 사용자가 선택한 파일
//     if (file) {
//         // Blob URL 생성
//         const blobUrl = URL.createObjectURL(file); // Blob URL 생성
//         photoPreview.src = blobUrl; // Blob URL을 미리보기 이미지에 적용
//     }
// });

// 메인 창에서 "주소 검색" 버튼 클릭 시 새 창 열기
document.getElementById('search-address-btn').addEventListener('click', () => {
    const popup = window.open('', '_blank', 'width=800,height=600');

    // 새 창 HTML 내용
    const popupContent = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>카카오 지도</title>
            <style>
                /* 스타일 정의 */
                .map_wrap, .map_wrap * {
                    margin: 0;
                    padding: 0;
                    font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
                    font-size: 12px;
                }
                .map_wrap {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                #map {
                    width: 100%;
                    height: 100%;
                }
                #placesList li {
                    list-style: none;
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                    cursor: pointer;
                }
                #placesList li:hover {
                    background-color: #f0f0f0;
                }
            </style>
            <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=942fcaff4cdbad94246811fba8b6e230&libraries=services"></script>
        </head>
        <body>
            <div class="map_wrap">
                <div id="map"></div>
                <div id="menu_wrap">
                    <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                    <button id="search-btn">검색</button>
                    <ul id="placesList"></ul>
                </div>
            </div>
            <script>
                // 카카오 지도 API 초기화
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new kakao.maps.LatLng(37.566826, 126.9786567),
                    level: 3
                };
                const map = new kakao.maps.Map(mapContainer, mapOption);
                const ps = new kakao.maps.services.Places();
                const markers = [];

                // 검색 버튼 클릭 이벤트
                document.getElementById('search-btn').addEventListener('click', () => {
                    const keyword = document.getElementById('keyword').value;
                    if (!keyword.trim()) {
                        alert('검색어를 입력해주세요.');
                        return;
                    }
                    ps.keywordSearch(keyword, placesSearchCB);
                });

                // 검색 결과 콜백 함수
                function placesSearchCB(data, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        displayPlaces(data);
                    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                        alert('검색 결과가 없습니다.');
                    } else {
                        alert('검색 도중 오류가 발생했습니다.');
                    }
                }

                // 검색 결과 표시 함수
                function displayPlaces(places) {
                    const placesList = document.getElementById('placesList');
                    placesList.innerHTML = '';
                    removeMarkers();

                    places.forEach((place, index) => {
                        const li = document.createElement('li');
                        li.textContent = place.place_name + ' - ' + (place.road_address_name || place.address_name);

                        li.addEventListener('click', () => {
                            sendToMainWindow(place);
                        });

                        placesList.appendChild(li);

                        // 지도에 마커 추가
                        const marker = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(place.y, place.x),
                            map: map
                        });
                        markers.push(marker);
                    });
                }

                // 메인 창으로 데이터 전송
                function sendToMainWindow(place) {
                    const address = place.road_address_name || place.address_name;
                    window.opener.postMessage({ address }, '*');
                    window.close();
                }

                // 마커 제거 함수
                function removeMarkers() {
                    markers.forEach(marker => marker.setMap(null));
                    markers.length = 0;
                }
            </script>
        </body>
        </html>
    `;

    // 새 창에 내용 삽입
    popup.document.write(popupContent);
});

// 메인 창에서 새 창으로부터 메시지를 수신
window.addEventListener('message', (event) => {
    if (event.data && event.data.address) {
        document.getElementById('address').value = event.data.address;
        alert('주소가 입력되었습니다: ' + event.data.address);
    }
});

// Step 1 데이터는 시간 값 대입 위해 함수 외부 선언
let step1Data = {
    classType: document.querySelector('.options .option.active')?.textContent || '',
    classFrequency: document.querySelector('.options .classFrequency.active')?.textContent || '',
    startTime: '', 
    endTime: ''  
};

async function collectAllData() {
    // Step 2 데이터
    const step2Data = {
        classTitle: document.getElementById('className').value || '',
        category: document.querySelector('select').value || '',
        classAddress: document.getElementById('address').value || '',
    };
    console.log('📌 Step 2 Data:', step2Data);

    // Step 3 데이터
    const thumbnailFileInput = document.getElementById('upload-class-photo-input');
    const selectedThumbnailFile = thumbnailFileInput?.files[0];

    let thumbnailURL = '';
    if (selectedThumbnailFile) {
        try {
            thumbnailURL = await uploadFile(selectedThumbnailFile);
            console.log(`📌 업로드된 대표 이미지 URL: ${thumbnailURL}`);
        } catch (error) {
            console.error("🚨 대표 이미지 업로드 실패:", error);
        }
    }

    const step3Data = {
        thumbnailURL,
        classImages, // handleImageUpload에서 업데이트된 배열 사용
    };

    console.log("📌 Step 3 Data:", step3Data);

    // 다른 데이터 수집
    const step4Data = {
        classIntroduce: contentEditor.getMarkdown(),
    };

    const step5Data = {
        difficulty: document.querySelector('.difficulty-btn.active')?.dataset.level || '',
        classPlayingTime: document.getElementById('duration').value || '',
        curriculum: document.getElementById('curriculum-description').value || '',
    };

    const step6Data = {
        instructorName: document.getElementById('nickname').value || '',
        instructorintroduce: document.getElementById('instructor-description').value || '',
        instructorPhoto: document.getElementById('photo-preview').src || '',
    };

    const step7Data = {
        classCount: document.getElementById('class-count').value || '',
        classPrice: document.getElementById('class-price').value || '',
        startDate: document.getElementById('start-date').value || '',
        endDate: document.getElementById('end-date').value || '',
        minPeople: document.getElementById('min-people').value || '',
        maxPeople: document.getElementById('max-people').value || '',
    };

    const data = {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        ...step4Data,
        ...step5Data,
        ...step6Data,
        ...step7Data,
    };

    console.log("📌 수집된 데이터 (서버로 전송 전):", data);
    return data;
}


// 시작 시간과 끝 시간 옵션 생성
function populateTimeOptions(selectElement) {
    for (let hour = 0; hour <= 24; hour++) {
        for (let minute = 0; minute <= 45; minute += 15) { // 15분 단위
            if (hour === 24 && minute > 0) break;
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const optiontime = document.createElement('option');
            optiontime.value = time;
            optiontime.textContent = time;
            selectElement.appendChild(optiontime);
        }
    }
}

// DOM 로드 후 옵션 채우기
document.addEventListener('DOMContentLoaded', () => {
    const startTimeSelect = document.getElementById('start-time');
    const endTimeSelect = document.getElementById('end-time');
    populateTimeOptions(startTimeSelect);
    populateTimeOptions(endTimeSelect);

    // 시작 시간 선택 이벤트
    startTimeSelect.addEventListener('change', (event) => {
        step1Data.startTime = event.target.value; // step1Data에 저장
        console.log('현재 Step 1 데이터:', step1Data); // 디버깅용
    });

    // 끝 시간 선택 이벤트
    endTimeSelect.addEventListener('change', (event) => {
        step1Data.endTime = event.target.value; // step1Data에 저장
        console.log('현재 Step 1 데이터:', step1Data); // 디버깅용
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.querySelector(".register");
    if (!registerButton) {
        console.error("🚨 .register 버튼이 존재하지 않습니다.");
        return;
    }

    registerButton.addEventListener("click", async () => {
        if (isUploading) {
            alert("이미지 업로드가 완료될 때까지 기다려 주세요.");
            return;
        }

        console.log("📌 register 버튼 클릭됨");

        try {
            console.log("classImages 보여줘 : " , classImages);
            const data = await collectAllData();
            console.log("📌 서버로 보낼 데이터:", data);

            const response = await fetch("/api/cooking/insert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`);
            }
            else if(response.ok){
                alert("등록 완료 되었습니다!");
                location.href="/searchClass";
            }
            const responseData = await response.json();
            console.log("📌 서버 응답 데이터:", responseData);
        } catch (error) {
            console.error("🚨 API 요청 또는 데이터 수집 중 오류:", error);
        }
    });
});

// document.querySelector(".register").addEventListener("click", async () => {
//     const data = await collectAllData(); // 데이터 수집
    

//     try {
//         const response = await fetch("/api/cooking/insert", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data), // 데이터를 JSON 형태로 전송
//         });

//         if (!response.ok) {
//             throw new Error(`API 요청 실패: ${response.status}`);
//         }

//         // 서버 응답 데이터
//         const responseData = await response.json();
//         console.log("✅ 서버 응답 데이터:", responseData);

//         if (responseData.success) {
//             alert(responseData.message);

//             // 상세 페이지로 이동
//             const redirectUrl = `/class/${responseData.classNo}`;
//             console.log("✅ 이동할 상세 페이지 URL:", redirectUrl);
//             window.location.href = redirectUrl;
//         } else {
//             console.error("🚨 서버 응답 실패:", responseData.message);
//             alert("클래스 생성 중 오류가 발생했습니다.");
//         }
//     } catch (error) {
//         console.error("🚨 클래스 생성 요청 에러:", error);
//     }
// });
