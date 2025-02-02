document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.cate-button');
    const loadMoreButton = document.getElementById('load-more');
    let currentCategory = 'all';
    let currentPage = 1;

    // 기본으로 전체 버튼 선택
    const allButton = document.querySelector('.cate-button[data-category="all"]');
    allButton.classList.add('selected');

    // 버튼 클릭 시 필터링된 레시피 호출
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            currentCategory = this.getAttribute('data-category');
            currentPage = 1;
            fetchRecipes(currentCategory, 1, true);
        });
    });

    // 기본으로 전체 레시피 로드
    fetchRecipes('all', 1, true);

    // 더보기 버튼 클릭 시 추가 레시피 로드
    loadMoreButton.addEventListener('click', function() {
        currentPage++;
        fetchRecipes(currentCategory, currentPage, false);
    });
});

// 카테고리에 해당하는 레시피를 불러오는 함수
function fetchRecipes(category, page, reset) {
    fetch(`/recipe/list?category=${category}&page=${page}`, {
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
            updateRecipeList(data.recipes, reset);
            document.getElementById('recipe-total-count').textContent = data.totalCount;
            if(data.recipes.length < 20) {
                document.getElementById('load-more').style.display = 'none';
            } else {
                document.getElementById('load-more').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
}

// 필터링된 레시피를 화면에 출력하는 함수
function updateRecipeList(recipes, reset) {
    const recipeList = document.getElementById('recipe-list');
    if(reset) {
        recipeList.innerHTML = '';
    }
    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="/recipe/detail/${recipe.recipe_no}">
                <img src="${recipe.thumbnail}" alt="${recipe.title}">
            </a>
            <p class="recipe-title">${recipe.title}</p>
            <p>ID: ${recipe.member_id}</p>
        `;
        recipeList.appendChild(li);
    });
}