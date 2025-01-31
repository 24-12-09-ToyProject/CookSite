

// 지역 나열
const regions = [
'서울','경기도','인천','대구','울산','광주',
'대전','부산','세종','경상남도','경상북도','전라남도','전라북도','충청남도','충청북도'
,'강원도','제주도'
]

//카테고리 나열
const categories = [
    '핸드메이드','쿠킹','플라워-가드닝','드로잉','음악','요가-필라테스','레져-스포츠'
    ,'뷰티','반려동물','체험','자기계발','로컬여행']

// 지역 드롭다운 변수 생성
const regionSpan = document.querySelector('.region');
const dropdownHeader = document.querySelector('.dropdown-header');
const dropdownContent1 = document.querySelector('.dropdown-content');
const arrow = document.querySelector('.arrow');

// 카테고리 드롭다운 변수 생성
const categorySpan = document.querySelector('.category');
const dropdownHeader2 = document.querySelector('.dropdown-header2');
const dropdownContent2 = document.querySelector('.dropdown-content2');
const arrow2 = document.querySelector('.arrow2');

// 인원 나열
const visitors =[
    '1명','2명','3명','4명','5명','6명','7명','8명','9명','10명이상','20명이상','30명이상']
// 인원 드롭다운 변수 생성
const visitorSpan = document.querySelector('.visitor');
const dropdownHeader3 = document.querySelector('.dropdown-header3');
const dropdownContent3 = document.querySelector('.dropdown-content3');
const arrow3 = document.querySelector('.arrow3');

// // 지역 동적 생성
// regions.forEach(region => {
//     const item = document.createElement('div');
//     item.className = 'dropdown-item';
//     item.textContent= region;

//     // 메뉴 클릭시 해당 값 상단헤더로 이동
//     item.addEventListener('click', () => {
//         regionSpan.textContent = region;
//         console.log('selected:' + region);
//         // 메뉴 클릭 시 드롭다운 사라짐
//         dropdownContent.classList.remove('show');
//         arrow.classList.remove('up');
//     });
//     dropdownContent.appendChild(item);
// });


// // 카테고리 드롭다운 내용 생성
// categories.forEach(category => {
//     const items = document.createElement('div');
//     items.className = 'dropdown-items';
//     items.textContent = category;
//         // 메뉴 클릭시 해당 값 상단헤더로 이동
//         items.addEventListener('click', () => {
//             categorySpan.textContent = category;
//             console.log('selected:' + category);
//             // 메뉴 클릭 시 드롭다운 사라짐
//             dropdownContent2.classList.remove('show');
//             arrow2.classList.remove('up');
//         });
//         dropdownContent2.appendChild(items);
// });

function createDropdown(items, dropdownHeader, dropdownContent, arrowElement,spanElement) {
    // 드롭다운 열기/닫기 이벤트 (한 번만 설정)
    dropdownHeader.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
        arrowElement.classList.toggle('up');
    });

    // 드롭다운 항목 생성
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dropdown-item';
        div.textContent = item;

        // 메뉴 클릭 시 동작 설정
        div.addEventListener('click', () => {
            spanElement.textContent = item;
            console.log('selected: ' + item);
            spanElement.classList.add('selected');
            // 드롭다운 닫기
            dropdownContent.classList.remove('show');
            arrowElement.classList.remove('up');
        });

        // 드롭다운 내용 추가
        dropdownContent.appendChild(div);
    });
    // 모든 옵션 드롭다운 외부 클릭시 닫기
    window.addEventListener('click', (e) => {
        if (!e.target.closest('[class^="option"]')) {
            dropdownContent.classList.remove('show');
            arrow.classList.remove('up');
        }
    });
}

createDropdown(regions, dropdownHeader, dropdownContent1, arrow,regionSpan);
createDropdown(categories, dropdownHeader2, dropdownContent2, arrow2,categorySpan);
createDropdown(visitors, dropdownHeader3, dropdownContent3, arrow3,visitorSpan);

// // 토글 만들기
// dropdownHeader.addEventListener('click', () => {
//     dropdownContent.classList.toggle('show');
//     arrow.classList.toggle('up');
// });

// //토글2 
// dropdownHeader2.addEventListener('click', () => {
//     dropdownContent2.classList.toggle('show');
//     arrow2.classList.toggle('up');
// });

// 유형 옵션
const classDayForm =[
    document.querySelector('.oneDay'),
    document.querySelector('.regular')
]
// 날짜 옵션
const Days = [
    document.querySelector('.weekdays'),
    document.querySelector('.saturday'),
    document.querySelector('.sunday')

]
// [TypeOne, TypeTwo].forEach(button => {
//     button.addEventListener('click', () => {
//         TypeOne.style.backgroundColor = "";
//         TypeTwo.style.backgroundColor = "";
//         button.style.backgroundColor = "red";
//     });
// });

// 유형 옵션 색깔 변경
function createChangeColortoForm(item) {
    item.addEventListener('click', () => {
        // 모든 버튼의 배경색 초기화
        classDayForm.forEach(button => {
            button.style.backgroundColor = "";
            button.classList.remove('selected');
        });
        // 클릭된 버튼의 배경색 변경
        item.style.backgroundColor = "red";
        // item.className ='selected';
        item.classList.add('selected');
    });
}

// 날짜 옵션 색깔 변경
function createChangeColortoDay(item) {
    item.addEventListener('click', () => {
        // 모든 버튼의 배경색 초기화
        Days.forEach(button => {
            button.style.backgroundColor ="";
            button.classList.remove('selected');
        });
        // 클릭된 버튼의 배경색 변경
        item.style.backgroundColor = "red";
        // item.className ="selected";
        item.classList.add('selected');
    });
}

classDayForm.forEach(button => createChangeColortoForm(button));
Days.forEach(button => createChangeColortoDay(button));

// 슬라이더 변수 설정
const sliders = {
    time: {
        valueMin: 0, // 초기 최소 시간 (540분 = 9:00 AM)
        valueMax: 1440, // 초기 최대 시간 (1080분 = 6:00 PM)
        total: 1440, // 하루 총 분 (24시간 * 60분)
        minLabel: document.getElementById('timeMin'),
        maxLabel: document.getElementById('timeMax'),
        thumbMin: document.getElementById('thumbMin'),
        thumbMax: document.getElementById('thumbMax'),
        range: document.querySelector('.slider-range'),
        format: (value) => {
            const hours = Math.floor(value / 60);
            const mins = value % 60;
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        },
    },
    price: {
        valueMin: 0, // 초기 최소 가격
        valueMax: 1000000, // 초기 최대 가격
        total: 1000000, // 총 가격 범위
        minLabel: document.getElementById('priceMin'),
        maxLabel: document.getElementById('priceMax'),
        thumbMin: document.getElementById('priceThumbMin'),
        thumbMax: document.getElementById('priceThumbMax'),
        range: document.querySelector('.price-slider-range'),
        format: (value) => `${value}원`, // 가격 표시 형식
    },
};

// 슬라이더 업데이트 함수
function updateSlider(slider) {
    const { valueMin, valueMax, total, minLabel, maxLabel, thumbMin, thumbMax, range, format } = slider;

    const minPercent = (valueMin / total) * 100;
    const maxPercent = (valueMax / total) * 100;

    thumbMin.style.left = `${minPercent}%`;
    thumbMax.style.left = `${maxPercent}%`;
    range.style.left = `${minPercent}%`;
    range.style.width = `${maxPercent - minPercent}%`;

    // 라벨 업데이트
    minLabel.textContent = format(valueMin);
    maxLabel.textContent = format(valueMax);
}

// 드래그 동작 처리 함수
function startDrag(e, slider, thumbType) {
    e.preventDefault();

    const { thumbMin, thumbMax, total } = slider;
    const rect = thumbMin.parentNode.getBoundingClientRect();

    const onMove = (moveEvent) => {
        const offsetX = moveEvent.clientX - rect.left;
        const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
        const newValue = Math.round(percentage * total);

        if (thumbType === 'min') {
            slider.valueMin = Math.min(newValue, slider.valueMax - 1); // 겹치지 않도록 설정
        } else if (thumbType === 'max') {
            slider.valueMax = Math.max(newValue, slider.valueMin + 1); // 겹치지 않도록 설정
        }

        updateSlider(slider);
    };

    const onStop = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onStop);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onStop);
}

// 각 슬라이더에 이벤트 리스너 추가
Object.values(sliders).forEach((slider) => {
    const { thumbMin, thumbMax } = slider;

    thumbMin.addEventListener('mousedown', (e) => startDrag(e, slider, 'min'));
    thumbMax.addEventListener('mousedown', (e) => startDrag(e, slider, 'max'));

    // 초기 슬라이더 업데이트
    updateSlider(slider);
});

// 난이도 설정
const level =[
    document.querySelector('.basic'),
    document.querySelector('.middle'),
    document.querySelector('.hard')
]
// 난이도 선택 시 색깔 변경
function createChangeColortoLevel(item) {
    item.addEventListener('click', () => {
      // 모든 span의 selected 클래스 제거 및 원래 배경색 복원
    level.forEach(button => {
        button.classList.remove('selected');
        button.style.backgroundColor = ""; // 기본 배경색
    });
    // 현재 클릭한 span에만 selected 클래스 추가 및 색상 변경
    item.classList.add('selected');
    // item.className="selected";
    
    item.style.backgroundColor = "red"; // 선택된 배경색
    });
}
// 함수 실행
level.forEach(button => createChangeColortoLevel(button));

// 온/오프라인 클래스 설정
const classType = [
    document.querySelector('.offline'),
    document.querySelector('.online')
]

// 클래스 클릭 시 색깔 변경
function createChangeColortoClass(item){
    item.addEventListener('click' , () => {
        classType.forEach(button => {
            button.style.backgroundColor ="";
            button.classList.remove=('selected');
        });
        item.classList.add('selected');
        // item.className ="selected";
        item.style.backgroundColor = "red";
        
    });
}
// 함수 실행
classType.forEach(button => createChangeColortoClass(button));

// 카드 데이터를 로드하는 함수
async function loadCards() {
    try {
        // API에서 JSON 데이터 가져오기
        const response = await fetch("/api/cooking");
        const cardData = await response.json();

        // DOM에 카드 추가
        const container = document.getElementById("card-container");
        const template = document.getElementById("card-template");

        //카드 개수 슬라이스
        const show_count = 9;
        let currentCount = 0;

        function renderdefaultCards(count){ // createClass js 에서 쓰기 위해 windows 로 전역 함수로 변경
            const cardsToShow = cardData.slice(currentCount, currentCount + count);
            cardsToShow.forEach((data) => {
                const card = template.content.cloneNode(true); 
                card.querySelector(".class-img").src = data.img;
                card.querySelector(".class-Tag").textContent = data.category;
                card.querySelector(".class-Name").textContent= data.title;
                
                 // a 태그 설정
                const cardLink = card.querySelector("a"); // 템플릿 내 a 태그를 선택
                cardLink.href = `/class/${data.classNo}`;
                container.appendChild(card);
            });
            currentCount += count;
            // 모든 카드가 표시되면 "더보기" 버튼 숨김
    if (currentCount >= cardData.length) {
        document.getElementById("load-more").style.display = "none";
    }
    }

    // 초기 카드 렌더링
    renderdefaultCards(show_count);

    // 더보기 버튼 클릭 이벤트
    document.getElementById("load-more").addEventListener("click", () => {
      renderCards(show_count); // 추가로 카드 렌더링
    });
    } catch (error) {
        console.error("카드 데이터를 불러오는 중 오류 발생:", error);
    }
}

// 페이지 로드 시 카드 데이터를 불러옴
document.addEventListener("DOMContentLoaded", loadCards);

// 검색 조건 필터
function getSearchFilters() {
    // 제목 검색
    const classTitle = document.getElementById("class-input").value.trim();
    // 온/오프라인 클래스 선택
    const classType = document.querySelector(".select-class .selected")?.textContent.trim()|| null;
    // 지역 선택
    const region = document.querySelector(".region.selected")?.textContent.trim() || null;

    // 클래스 타입 (원데이, 정기)
    const classFrequency = document.querySelector(".class .selected")?.textContent.trim() || null;

    // 카테고리
    const category = document.querySelector(".category.selected")?.textContent.trim() || null;

    // 방문자 수
    const visitor = document.querySelector(".visitor.selected")?.textContent.trim() || null;

    // 요일 선택 (평일, 토요일, 일요일)
    const weekdays = document.querySelector(".day .selected")?.textContent.trim() || null;

    // 난이도 (입문, 중급, 고급)
    const difficulty = document.querySelector(".difficulty .selected")?.textContent.trim() || null;

    // 시간 범위
    const timeMin = document.getElementById("timeMin").textContent;
    const timeMax = document.getElementById("timeMax").textContent;

    // 가격 범위
    const priceMin = parseInt(document.getElementById("priceMin").textContent.replace(/,/g, ""), 10);
    const priceMax = parseInt(document.getElementById("priceMax").textContent.replace(/,/g, ""), 10);
    // 추천 검색어
    console.log("classType:", classType);
    console.log("difficulty:", difficulty);
    console.log("weekdays:", weekdays);

    // 반환 객체
    return {
        classTitle,
        region,
        classType,
        classFrequency,
        category,
        visitor,
        weekdays,
        difficulty,
        timeMin,
        timeMax,
        priceMin,
        priceMax,
    };
}
// 검색 버튼 및 추천 검색어 클릭 이벤트 통합
async function performSearch(keyword = null) {
    // 1. 검색 조건 수집
    const filters = getSearchFilters();

    // 2. 추천 검색어가 있다면 카테고리 덮어쓰기
    if (keyword) {
        console.log("추천 검색어가 적용되었습니다:", keyword);
        filters.category = keyword; // 추천 검색어로 카테고리를 설정
    }

    // 3. 빈 값 제거
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined)
    );

    console.log("디버깅 - 최종 검색 필터 데이터:", cleanFilters);

    // 4. API 호출 및 결과 반환
    const filteredCards = await fetchFilteredCards(cleanFilters);

    // 5. 결과 렌더링
    if (!Array.isArray(filteredCards)) {
        console.error("API 응답 데이터가 배열이 아닙니다:", filteredCards);
        document.getElementById("card-container").innerHTML = "<p>검색 결과가 없습니다</p>";
        return;
    }

    if (filteredCards.length === 0) {
        console.log("검색 결과가 없습니다.");
        document.getElementById("card-container").innerHTML = "<p>검색 결과가 없습니다</p>";
    } else {
        renderCards(filteredCards);
    }
}

// 검색 버튼 클릭 이벤트
document.getElementById("searchButton").addEventListener("click", () => performSearch());

// 추천 검색어 클릭 이벤트
document.querySelectorAll(".keywordType").forEach((element) => {
    element.addEventListener("click", () => {
        const keyword = element.textContent.trim() || null;
        performSearch(keyword);
    });
});

// 필터 API 호출 함수
async function fetchFilteredCards(filters = {}) {
    try {
        const response = await fetch("/api/cooking/filter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filters),
        });

        if (!response.ok) {
            throw new Error(`API 요청 실패 - 상태 코드: ${response.status}`);
        }

        const data = await response.json();
        console.log("디버깅 - 서버 응답 데이터:", data);
        return data || [];
    } catch (error) {
        console.error("필터 API 호출 오류:", error);
        return [];
    }
}

// DOM에 카드 렌더링
// function renderCards(filteredCards) {
//     const container = document.getElementById("card-container");
//     const template = document.getElementById("card-template");

//     // // 기존 카드 삭제
//     container.innerHTML = "";

//     // 새 카드 추가
//     filteredCards.forEach((data) => {
//         const card = template.content.cloneNode(true);
//         card.querySelector(".class-img").src = data.CLASS_THUMBNAIL_IMG;
//         card.querySelector(".class-Tag").textContent = data.CLASS_CATEGORY;
//         card.querySelector(".class-Name").textContent = data.CLASS_TITLE;
//         const resultCount = filteredCards.length;
//         document.querySelector(".cookinglist-searchresult").textContent = resultCount + "개의 결과";       
        
//         // 클래스 ID 부여
//         const cardLink = card.querySelector("a");
//         if (!data.classNo) {
//             console.error("classNo가 존재하지 않음:", data);
//         }
//         cardLink.href = `/class/${data.classNo || "undefined"}`;
//         cardLink.dataset.classNo = data.classNo;
//         container.appendChild(card);
//     });

//         // 카드가 없는 경우 메시지 표시
//         if (filteredCards.length === 0) {
//             container.innerHTML = "<p>검색 결과가 없습니다.</p>";
//         }
// };
//     //renderCards전역함수 활성화
//     window.renderCards = renderCards;

function renderCards(filteredCards) {
    const container = document.getElementById("card-container");
    const template = document.getElementById("card-template");

    // 기존 카드 삭제
    container.innerHTML = "";

    // 새 카드 추가
    filteredCards.forEach((data) => {
        const card = template.content.cloneNode(true);
        card.querySelector(".class-img").src = data.CLASS_THUMBNAIL_IMG;
        card.querySelector(".class-Tag").textContent = data.CLASS_CATEGORY;
        card.querySelector(".class-Name").textContent = data.CLASS_TITLE;
        // ✅ classNo가 있는지 확인 후 반영
            const cardLink = card.querySelector("a");
            cardLink.href = `/class/${data.CLASS_NO}`;
            cardLink.dataset.classNo =`${data.CLASS_NO}`;


        container.appendChild(card);
    });

    // 카드가 없는 경우 메시지 표시
    if (filteredCards.length === 0) {
        container.innerHTML = "<p>검색 결과가 없습니다.</p>";
    }
}

// ✅ 전역함수 활성화
window.renderCards = renderCards;

