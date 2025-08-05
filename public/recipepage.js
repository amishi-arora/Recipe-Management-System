async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    // const rForm = document.getElementById('recipeFormDiv');
    // const recBut = document.getElementById('newRecBut'); 
    // const subBut = document.getElementById('submitRecipe')

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });


    // recBut.addEventListener('click', () => (rForm.style.display = "block")); 

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

const rDeleteBut = document.getElementById('delRec'); 
const rDelFormDiv = document.getElementById('rDelFormDiv'); 
rDeleteBut.addEventListener('click', () => (rDelFormDiv.style.display = "block")); 

async function fetchAndDisplayRecipes() {
    const recipeDisplay = document.getElementById('recipe-container'); 

    const response = await fetch('/recipes', {
        method: 'GET'
    });

    const responseData = await response.json();
    const recipes = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    recipeDisplay.innerHTML = ''; 

    recipes.forEach(recipe => {
        const r = document.createElement('button'); 

        r.className = 'rDiv'; 
        r.innerHTML = recipe[1]; 
        recipeDisplay.appendChild(r);

        r.addEventListener('click', () => {
            window.open('/recipe/' + recipe[0]); 
            // const recipeInfo = document.createElement('div');
            // recipeInfo.id = 'recipeInfo';
            // recipeInfo.innerHTML = recipe[1] + '<br>' + 'Description: ' + recipe[2] + '<br>' + recipe[4] + ' servings<br>';
            // recipeDisplay.appendChild(recipeInfo);
            // const ingredients = document.createElement('div');
        });
    })
}


// deletedrecipe from recipe table 
async function deleteRecipe(event) {
    event.preventDefault();
    const recipeID = document.getElementById('rID').value;

    const response = await fetch('/delete-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: recipeID
        })
    });
    

    const responseData = await response.json();
    const deleteMessageElement = document.getElementById('deleteRecipeResultMsg');

    if (responseData.success) {
        deleteMessageElement.textContent = "Recipe deleted successfully!";
        fetchTableData();
        document.getElementById('rID').value = ''; 
    } else {
        deleteMessageElement.textContent = "Error deleting recipe!";
    }

}


// Inserts new recipe in recipe table 
async function insertRecipe(event) {
    event.preventDefault();
    const titleValue = document.getElementById('titleID').value;
    const descValue = document.getElementById('descID').value;
    const servValue = document.getElementById('servID').value;
    const userId = document.getElementById('recUserId').value;

    const response = await fetch('/insert-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: Math.floor(Math.random() * 100) + 1,  
            title: titleValue,
            description: descValue,
            servings: servValue, 
            userId: userId
        })
    });
    

    const responseData = await response.json();
    const rmessageElement = document.getElementById('insertRecipeResultMsg');

    if (responseData.success) {
        rmessageElement.textContent = "Recipe inserted successfully!";
        fetchTableData();
    } else {
        rmessageElement.textContent = "Error inserting recipe!";
    }

}

async function filterRecipe(event) { 
    event.preventDefault();
    const recipeDisplay = document.getElementById('recipe-container');

    const titleCon = document.getElementById('titleCon').value;
    const fil1 = document.getElementById('filter1').value;
    const fil2 = document.getElementById('filter2').value;
    const serLess = document.getElementById('servTo').value;
    const serMore = document.getElementById('servFrom').value;
    
    // Always clear old, already fetched data before new fetching process.
    
    const response = await fetch('/recipe-filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            titleCon: titleCon,
            fil1: fil1,
            fil2: fil2,
            serLess: serLess,
            serMore: serMore
        })
    });
    const responseData = await response.json();
    const recipes = responseData.data;
    
    recipeDisplay.innerHTML = ''; 
    recipes.forEach(recipe => {
        const r = document.createElement('button'); 

        r.className = 'rDiv'; 
        r.innerHTML = recipe[1]; 
        recipeDisplay.appendChild(r);


        r.addEventListener('click', () => {
           window .open(window.location.href + 'recipe/' + recipe[0])
        });
    })

}


window.onload = function() {
    checkDbConnection();
    fetchTableData();
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById('submitRecipe').addEventListener("click", insertRecipe); 
    document.getElementById('deleteRecipe').addEventListener("click", deleteRecipe); 
    document.getElementById('submitFilter').addEventListener("click", filterRecipe); 
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // fetchAndDisplayUsers();
    fetchAndDisplayRecipes(); 

}