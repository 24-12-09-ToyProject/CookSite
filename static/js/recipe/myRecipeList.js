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

// 한 개의 레시피를 삭제하는 함수
function deleteOneRecipe(recipeNo, recipeElement) {
    if(confirm('정말 삭제하시겠습니까?')) {
        fetch(`/recipe/delete/${recipeNo}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            return response.json().then(body => ({ response, body }));
        })
        .then(({ response, body }) => {
            if(response.ok) {
                console.log('삭제 성공:', body.message);
                alert(body.message);
                recipeElement.remove();
            } else {
                console.error('레시피 삭제 실패: ', body.message);
                alert('레시피 삭제에 실패했습니다. 다시 시도해 주세요.');
            }
        })
        .catch(error => {
            console.error('Error deleting recipe:', error);
            alert('레시피 삭제 중 오류가 발생했습니다.');
        });
    }
}

// 카테고리에 해당하는 레시피를 불러오는 함수
function fetchRecipes(category, page, reset) {
    fetch(`/recipe/myList?category=${category}&page=${page}`, {
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
            document.getElementById('my-recipe-total-count').textContent = data.totalCount;
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
    const myRecipeList = document.getElementById('my-recipe-list');
    if(reset) {
        myRecipeList.innerHTML = '';
    }
    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="/recipe/detail/${recipe.recipe_no}" class>
                <img src="${recipe.thumbnail}" alt="${recipe.title}">
            </a>
            <p class="recipe-title">${recipe.title}</p>
            <button class="update-recipe-btn" data-recipe-id="${recipe.recipe_no}">수정</button>
            <button class="delete-recipe-btn" data-recipe-id="${recipe.recipe_no}">삭제</button>
        `;
        myRecipeList.appendChild(li);

        // 삭제 버튼 클릭 시 함수 호출
        const deleteButton = li.querySelector('.delete-recipe-btn');
        deleteButton.addEventListener('click', function() {
            const recipeNo = this.getAttribute('data-recipe-id');
            const recipeElement = this.closest('li');
            deleteOneRecipe(recipeNo, recipeElement);
        });

        // 수정 버튼 클릭 시 함수 호출
        const updateButton = li.querySelector('.update-recipe-btn');
        updateButton.addEventListener('click', function() {
            if(confirm('레시피 수정 화면으로 이동합니다.')) {
                const recipeNo = this.getAttribute('data-recipe-id');
                window.location.href = `/recipe/update/${recipeNo}`;
            }
        });
    });
}