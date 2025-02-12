document.addEventListener('DOMContentLoaded', function() {
    // window 객체를 통해 전역 변수로 선언된 데이터를 사용
    const ingredients = window.recipeData.ingredients.split(', '); // , 기준으로 배열 생성
    const ingredientsList = document.getElementById('ingredients-list');

    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        
        // 각 재료와 양을 분리하여 span 태그로 나누기
        const parts = ingredient.trim().split(' ');
        const name = parts.slice(0, -1).join(' '); // 마지막 부분 제외한 나머지
        const amount = parts.slice(-1).join(''); // 마지막 부분

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;

        const amountSpan = document.createElement('span');
        amountSpan.textContent = amount;
        amountSpan.classList.add('amount');

        li.appendChild(nameSpan);
        li.appendChild(amountSpan);
        ingredientsList.appendChild(li);
    });

});