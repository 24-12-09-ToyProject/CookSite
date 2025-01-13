// 지역 나열
const regions = [
'서울','경기도','인천','대구','울산','광주',
'대전','부산','세종','경상남도','경상북도','전라남도','전라북도','충청남도','충청북도'
,'강원도','제주도'
]

// 드롭다운에 지역 넣기
const span = document.querySelector('.region');
const dropdownHeader = document.querySelector('.dropdown-header');
const dropdownContent = document.querySelector('.dropdown-content');
const arrow = document.querySelector('.arrow');

// 지역 동적 생성
regions.forEach(region => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.textContent= region;

    // 메뉴 클릭시 해당 값 상단헤더로 이동
    item.addEventListener('click', () => {
        span.textContent = region;
        console.log('Selected:' . region);

        dropdownContent.classList.remove('show');
        arrow.classList.remove('up');
    });
    dropdownContent.appendChild(item);
});

// 토글 만들기
dropdownHeader.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
    arrow.classList.toggle('up');
});

// 드롭다운 외부 클릭시 닫기
window.addEventListener('click', (e) => {
    if (!e.target.closest('.option1')) {
        dropdownContent.classList.remove('show');
        arrow.classList.remove('up');
    }
});


// 유형 선택 시 색깔 변경
const TypeOne = document.querySelector('.firstType');
const TypeTwo = document.querySelector('.secondType');

TypeOne.addEventListener('click', () => {
    TypeOne.style.backgroundColor="red"
    TypeTwo.style.backgroundColor="";
});

TypeTwo.addEventListener('click', () => {
    TypeOne.style.backgroundColor=""
    TypeTwo.style.backgroundColor="red";
});
