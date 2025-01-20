// 클래스 설정
const statusOfClasses = [
document.querySelector('.offline'),
document.querySelector('.online')
];
function createChangeColortoOnOffLine(item){
    item.addEventListener('click', () => {
        statusOfClasses.forEach(button => statusOfclass)
    })
}

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
        classDayForm.forEach(button => button.style.backgroundColor = "");
        // 클릭된 버튼의 배경색 변경
        item.style.backgroundColor = "red";
    });
}

// 날짜 옵션 색깔 변경
function createChangeColortoDay(item) {
    item.addEventListener('click', () => {
        // 모든 버튼의 배경색 초기화
        Days.forEach(button => button.style.backgroundColor ="");
        // 클릭된 버튼의 배경색 변경
        item.style.backgroundColor = "red";
    });
}

classDayForm.forEach(button => createChangeColortoForm(button));
Days.forEach(button => createChangeColortoDay(button));

// 슬라이더 변수 설정
const sliders = {
    time: {
        valueMin: 540, // 초기 최소 시간 (540분 = 9:00 AM)
        valueMax: 1080, // 초기 최대 시간 (1080분 = 6:00 PM)
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
function createChangeColortoLevel(item){
    item.addEventListener('click',()=>{
        level.forEach(button => button.style.backgroundColor ="");
        item.style.backgroundColor ="red";
    })
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
        classType.forEach(button => button.style.backgroundColor ="");
        item.style.backgroundColor = "red";
    })
}
// 함수 실행
classType.forEach(button => createChangeColortoClass(button));



