document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.cate-button');

    // 버튼 클릭 시 필터링된 레시피 호출
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            fetch(`/recipe/list?category=${category}`, {
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log('응답 데이터:', data);
                    if (data.error) {
                        console.error('Server error:', data.error);
                        return;
                    }
                    updateRecipeList(data.recipes);
                })
                .catch(error => {
                    console.error('Error fetching recipes:', error);
                });
        });
    });
});

// 필터링된 레시피를 화면에 출력하는 함수
function updateRecipeList(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        console.log('recipe 데이터:', recipe); 
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="/recipe/detail/${recipe.recipe_no}">
                <img src="${recipe.thumbnail}" alt="${recipe.title}">
            </a>
            <h3 class="recipe-title">${recipe.title}</h3>
            <p>ID: ${recipe.member_id}</p>
        `;
        recipeList.appendChild(li);
    });
    document.getElementById('recipe-count').textContent = recipes.length;
}
