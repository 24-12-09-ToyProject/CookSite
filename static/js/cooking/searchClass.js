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
const dropdownContent = document.querySelector('.dropdown-content');
const arrow = document.querySelector('.arrow');

// 카테고리 드롭다운 변수 생성
const categorySpan = document.querySelector('.category');
const dropdownHeader2 = document.querySelector('.dropdown-header2');
const dropdownContent2 = document.querySelector('.dropdown-content2');
const arrow2 = document.querySelector('.arrow2');


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

function createDropdown(items, spanElement, dropdownContent, arrowElement) {
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
}

createDropdown(regions, regionSpan, dropdownContent, arrow);
createDropdown(categories, categorySpan, dropdownContent2, arrow2);

// 토글 만들기
dropdownHeader.addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
    arrow.classList.toggle('up');
});

//토글2 
dropdownHeader2.addEventListener('click', () => {
    dropdownContent2.classList.toggle('show');
    arrow2.classList.toggle('up');
});


// 모든 옵션 드롭다운 외부 클릭시 닫기
window.addEventListener('click', (e) => {
    if (!e.target.closest('[class^="option"]')) {
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


