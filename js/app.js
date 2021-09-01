const messageTag = document.getElementById('message');
const cardContainer = document.getElementById('card-container');

//Maitains spinner visibility
const spinnerDisplay = display => {
    const spinnerContainer = document.getElementById('spinner');
    spinnerContainer.style.display = display;
}

//Maitains Card Container visibility
const cardContainerDisplay = display => {
    cardContainer.style.display = display;
}

const searchRecipe = () => {
    messageTag.innerText = '';
    cardContainerDisplay('none');
    const searchInput = document.getElementById('serch-input');
    if (searchInput.value === '') {
        messageTag.innerText = 'Please search with food name.'
        return;
    }
    spinnerDisplay('block');

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`
    fetch(url)
        .then(response => response.json())
        .then(data => displayRecipe(data.meals));
    searchInput.value = '';
};

const displayRecipe = data => {
    spinnerDisplay('none');
    const recipeContainer = document.getElementById('recipe-containers');
    recipeContainer.textContent = '';
    if (data == null) {
        messageTag.innerText = 'No results found! Please try a different recipe.'
        return;
    }
    cardContainerDisplay('block');
    messageTag.innerText = '';
    data.forEach(element => {
        const div = document.createElement('div')
        div.innerHTML = `
        <div class="card h-100">
            <img src="${element.strMealThumb}" class="card-img-top h-50" alt="...">
            <div class="card-body">
                <h5 class="card-title py-3 fw-bolder">${element.strMeal}</h5>
                <p class="card-text text-secondary mb-3 fst-italic fw-bold">Ingredients: ${element.strIngredient1}, ${element.strIngredient2}, ${element.strIngredient3}, ${element.strIngredient4} and more.</p>
                <p class="card-text text-secondary mb-4">${element.strInstructions.slice(0, 250)}</p>
                <button onclick="getRecipeById('${element.idMeal}')" type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">Show More</button>
            </div>
        </div>`;
        div.classList.add('col');
        recipeContainer.appendChild(div);
    });
    cardContainer.classList.add('bg-warning', 'bg-opacity-10')
};

const getRecipeById = id => {
    console.log(id)
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => showDetailedRecipe(data.meals[0]));
};

const showDetailedRecipe = data => {
    const recipeModal = document.getElementById('recipe-modal');
    recipeModal.textContent = '';
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="modal-header d-block">
            <h3 class="modal-title fw-bolder text-warning text-center" id="exampleModalLabel">${data.strMeal}</h3>
        </div>
        <div class="modal-body p-5">
            <div class="row">
                <div class="col-md-6">
                    <img src="${data.strMealThumb}" class="border border-3 border-warning img-fluid rounded-3" alt="...">
                </div>
                <div class="col-md-6">
                    <p class="text-secondary fst-italic fw-bold mb-3">Ingredients: ${data.strIngredient1}, ${data.strIngredient2}, ${data.strIngredient3}, ${data.strIngredient4}, ${data.strIngredient5}, ${data.strIngredient6}, ${data.strIngredient7 ? data.strIngredient7 : ''}, ${data.strIngredient8 ? data.strIngredient8 : ''}</p>
                    <p class="text-secondary">${data.strInstructions.slice(0, 500)}-</p>
                </div>
            </div>
            <p class="text-secondary mt-3">${data.strInstructions.slice(500)}</p>
            <div>
                Tags: <span class="badge bg-info text-dark">${data.strCategory}</span> 
                <span class="badge bg-secondary">${data.strArea}</span>
                <span class="badge bg-success">${data.strTags ? data.strTags : ''}</span>
            </div>
        </div>
        <div class="modal-footer border-0">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
        </div>`;
    recipeModal.appendChild(div);
};