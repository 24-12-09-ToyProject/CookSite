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

// 다음 클릭 시 번호 이동
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

// 대표 및 클래스 내용 이미지 관련 요소
const photoContainers = [
    {
        container: document.getElementById("upload-class-photo-container"),
        input: document.getElementById("upload-class-photo-input"),
        preview: document.getElementById("class-photo-preview"),
    },
    {
        container: document.getElementById("upload-class-content-container"),
        input: document.getElementById("upload-class-content-input"),
        preview: document.getElementById("class-content-preview"),
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
            return result.url; // 서버에서 반환된 GCS URL
        } else {
            console.error("업로드 실패:", await response.text());
            throw new Error("업로드 실패");
        }
    } catch (error) {
        console.error("업로드 중 에러 발생:", error);
        throw error;
    }
}

// 파일 선택 후 이미지 업로드 및 미리보기 업데이트
async function handleFileUpload(input, previewElement) {
    const file = input.files[0];
    if (file) {
        // 1. 로컬 미리보기 표시
        const blobUrl = URL.createObjectURL(file);
        previewElement.src = blobUrl;

        // 2. 파일 업로드
        try {
            const uploadedUrl = await uploadFile(file); // 파일 업로드
            previewElement.src = uploadedUrl; // 업로드된 GCS URL로 업데이트
        } catch (error) {
            console.error("업로드 중 오류:", error);
        }
    }
}

// 모든 컨테이너에 클릭 및 파일 업로드 이벤트 추가
photoContainers.forEach(({ container, input, preview }) => {
    if (!container || !input || !preview) {
        console.error("필수 DOM 요소가 정의되지 않았습니다.");
        return;
    }
    // 클릭 시 파일 선택 창 열기
    container.addEventListener("click", () => input.click());

    // 파일 선택 후 처리
    input.removeEventListener("change", handleFileUpload);
    input.addEventListener("change", () => handleFileUpload(input, preview));
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
        classTitle: document.getElementById('className').value || '', // 제목
        category: document.querySelector('select').value || '',      // 카테고리
        classAddress: document.getElementById('address').value || '' // 주소
    };
    console.log('Step 2 Data:', step2Data);
 // Step 3 데이터 (이미지 업로드)
    const thumbnailFile = document.getElementById('upload-class-photo-input').files[0];
    const classImageFiles = Array.from(document.getElementById('upload-class-content-input').files);

    const thumbnailURL = thumbnailFile ? await uploadFile(thumbnailFile) : '';
    const classImagesURLs = await Promise.all(classImageFiles.map(uploadFile));

    const step3Data = {
     thumbnailURL, // 업로드된 GCS URL
     classImages: classImagesURLs, // 업로드된 GCS URL 배열
    };

    // Step 4 데이터 (에디터 콘텐츠)
    const step4Data = {
        classIntroduce: contentEditor.getMarkdown(), // 에디터에서 Markdown 데이터를 가져옴
    };

    // Step 5 데이터
    const step5Data = {
        difficulty: document.querySelector('.difficulty-btn.active')?.dataset.level || '',
        classPlayingTime: document.getElementById('duration').value || '',
        curriculum: document.getElementById('curriculum-description').value || '',
    };

    // Step 6 데이터
    const step6Data = {
        instructorName: document.getElementById('nickname').value || '',
        instructorintroduce: document.getElementById('instructor-description').value || '',
        instructorPhoto: document.getElementById('photo-preview').src || '',
    };

    // Step 7 데이터
    const step7Data = {
        classCount: document.getElementById('class-count').value || '',
        classPrice: document.getElementById('class-price').value || '',
        startDate: document.getElementById('start-date').value || '',
        endDate: document.getElementById('end-date').value || '',
        minPeople: document.getElementById('min-people').value || '',
        maxPeople: document.getElementById('max-people').value || '',
    };

    // 모든 데이터를 통합하여 반환
    return {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        ...step4Data,
        ...step5Data,
        ...step6Data,
        ...step7Data
    };
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
document.querySelector('.register').addEventListener('click', async () => {
    const data = await collectAllData();
    console.log('수집된 데이터:', data)
    try {
        const response = await fetch('/api/cooking/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            alert('클래스가 성공적으로 등록되었습니다!');
            location.href="/";
        } else {
            alert('클래스 등록 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('서버와의 통신 중 오류:', error);
        alert('클래스 등록에 실패했습니다.');
    }
});


