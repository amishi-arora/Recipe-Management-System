
// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');
   
    const response = await fetch('/check-db-connection', {
        method: "GET"
    });


  
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



async function displayRecipe() {
    const recipeDisplay = document.getElementById('recipe'); 

    const url = window.location.href.split('/');
    const rID = url[url.length - 1];

    const selectedColumns = document.querySelectorAll('input[name = recipeattributes]:checked')
    const columnNames = Array.from(selectedColumns).map(checkbox => checkbox.value); 
    const response = await fetch ('/getrecipe', {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: rID, 
            columns: columnNames
        })
        
    });

    const responseData = await response.json();
    const recipe = responseData.data[0]; 

    

    // Always clear old, already fetched data before new fetching process.
    recipeDisplay.innerHTML = ''; 


    columnNames.forEach((col, index) => {
        const detailDiv = document.createElement('div'); 
        detailDiv.innerHTML = `${col}: ${recipe[index]}`; 
        recipeDisplay.appendChild(detailDiv); 
    })

    if (responseData.success) {
        fetchTableData();
    } else {
        console.log('error'); 
    }


}

async function updateRecipeTitle(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldTitle').value;
    const newNameValue = document.getElementById('updateNewTitle').value;
    const url = window.location.href.split('/');
    const rID = url[url.length - 1];

    const response = await fetch('/update-title', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldTitle: oldNameValue,
            newTitle: newNameValue,
            rID: rID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateTitleResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Title updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating title!";
    }
}

async function updateRecipeUser(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldUser').value;
    const newNameValue = document.getElementById('updateNewUser').value;
    const url = window.location.href.split('/');
    const rID = url[url.length - 1];

    const response = await fetch('/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldUser: oldNameValue,
            newUser: newNameValue,
            rID: rID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateUserResultMsg');

    if (responseData.success) {
        messageElement.textContent = "User updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating user!";
    }
}

async function updateRecipeServings(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldServing').value;
    const newNameValue = document.getElementById('updateNewServing').value;
    const url = window.location.href.split('/');
    const rID = url[url.length - 1];

    const response = await fetch('/update-serving', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldServing: oldNameValue,
            newServing: newNameValue,
            rID: rID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateServingResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Servings updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating servings!";
    }
}

async function updateRecipeDesc(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldDesc').value;
    const newNameValue = document.getElementById('updateNewDesc').value;
    const url = window.location.href.split('/');
    const rID = url[url.length - 1];

    const response = await fetch('/update-desc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldDesc: oldNameValue,
            newDesc: newNameValue,
            rID: rID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateDescResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Description updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating description!";
    }
}

async function displaySteps() {
    const stepDisplay = document.getElementById('steps'); 
    

    const url = window.location.href.split('/');
    const rID = url[url.length - 1];
    const response = await fetch('/getsteps', {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: rID
        })
        
    });

    stepDisplay.innerHTML = ''; 

    const responseData = await response.json();
    const steps = responseData.data;
    console.log(steps);
    
    steps.forEach(step => {
        const s = document.createElement('div'); 
        s.innerHTML = step[1] + '. ' +step[3]; 
        stepDisplay.appendChild(s);
    })
}


async function insertEquipment(event) {
    event.preventDefault();
    const equipmentName = document.getElementById('eqName').value;
    const buyFrom = document.getElementById('buyFrom').value;
    const url = window.location.href.split('/');
    const recipeID = url[url.length - 1];

    const response = await fetch('/insert-equipment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            eName: equipmentName, 
            whereToBuy: buyFrom,   
            rID: recipeID
        })
    });
    
    const responseData = await response.json();
    const messageElement = document.getElementById('addEqResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Equipment inserted!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting equipment!";
        console.log('error'); 
    }

}

async function insertIngredient(event) {
    event.preventDefault();
    const ingredientName = document.getElementById('inName').value;
    const ingredientType = document.getElementById('inType').value;
    const ingredientAmount = document.getElementById('inAmount').value;
    const ingredientCost = document.getElementById('inCost').value;
    const url = window.location.href.split('/');
    const recipeID = url[url.length - 1];

    const response = await fetch('/insert-ingredient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            iName: ingredientName, 
            iType:  ingredientType,  
            iAmount: ingredientAmount,
            iCost: parseFloat(ingredientCost),
            rID: recipeID
        })
    });
    
    const responseData = await response.json();
    const messageElement = document.getElementById('newIngResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Ingredient inserted!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting ingredient!";
        console.log('error'); 
    }

}


async function insertTag(event) {
    event.preventDefault();
    const tagName = document.getElementById('tagName').value;
    const typeName = document.getElementById('typeName').value;
    const url = window.location.href.split('/');
    const recipeID = url[url.length - 1];

    const response = await fetch('/insert-tag', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: typeName,  
            tname: tagName, 
            rID: recipeID
        })
    });
    

    const responseData = await response.json();
    const messageElement = document.getElementById('newTagResultMsg');
    if (responseData.success) {
        messageElement.textContent = "Tag inserted!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting tag!";
        console.log('error'); 
    }

}


async function fetchAndDisplayEquipment() {
    const eqDisplay = document.getElementById('equipment-container');
    const url = window.location.href.split('/');
    const recipeID = url[url.length - 1];

    const response = await fetch('/requireseq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: recipeID
        })
    });

    const responseData = await response.json();
    const eqContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    eqDisplay.innerHTML = ''; 

    eqContent.forEach(eq => {
        const tr = document.createElement('tr'); 
        const nameCell = document.createElement("td"); 
        nameCell.textContent = eq[0]; 
        const buyCell = document.createElement("td"); 
        buyCell.textContent = eq[1]; 
        tr.appendChild(nameCell); 
        tr.appendChild(buyCell); 
        eqDisplay.appendChild(tr); 
    });
}

async function fetchAndDisplayEquipmentByStore() {
    const eqDisplay = document.getElementById('equipment-container');
    const storeName = document.getElementById('store').value; 

    if(storeName === "") {
        fetchAndDisplayEquipment(); 
    }
    else {
        const url = window.location.href.split('/');
        const recipeID = url[url.length - 1];

        const response = await fetch('/requireseqstore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rID: recipeID,
                store: storeName
            })
        });

        const responseData = await response.json();
        const eqContent = responseData.data;

        // Always clear old, already fetched data before new fetching process.
        eqDisplay.innerHTML = ''; 

        eqContent.forEach(eq => {
            const tr = document.createElement('tr'); 
            const nameCell = document.createElement("td"); 
            nameCell.textContent = eq[0]; 
            const buyCell = document.createElement("td"); 
            buyCell.textContent = eq[1]; 
            tr.appendChild(nameCell); 
            tr.appendChild(buyCell); 
            eqDisplay.appendChild(tr); 
        });
}

}

async function fetchAndDisplayIngredient() {
    const ingDisplay = document.getElementById('ingredient-container');
    const url = window.location.href.split('/');
    const recipeID = url[url.length - 1];

    const response = await fetch('/recipeingredients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: recipeID
        })
    });

    const responseData = await response.json();
    const ingContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    ingDisplay.innerHTML = ''; 

    ingContent.forEach(ing => {
        const tr = document.createElement('tr'); 
        const nameCell = document.createElement("td"); 
        nameCell.textContent = ing[0]; 
        const costCell = document.createElement("td"); 
        costCell.textContent = ing[1]; 
        const amountCell = document.createElement("td"); 
        amountCell.textContent = ing[2]; 
        tr.appendChild(nameCell); 
        tr.appendChild(costCell); 
        tr.appendChild(amountCell); 
        ingDisplay.appendChild(tr); 
    });
}


async function fetchAndDisplayTags() {
    const tagDisplay = document.getElementById('tag-container');
    const url = window.location.href.split('/');
    const recipeID = url[url.length - 1];

    const response = await fetch('/recipetags', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: recipeID
        })
    });

    const responseData = await response.json();
    const tagContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    tagDisplay.innerHTML = ''; 

    tagContent.forEach(tag => {
        const t = document.createElement('span'); 
        t.className = "tags"
        t.innerHTML = tag[1]; 
        tagDisplay.appendChild(t); 
    });
}

async function addStep(event) {
    event.preventDefault();
    const det = document.getElementById('detail').value;
    const url = window.location.href.split('/');
    const recipeID = url[url.length - 1];

    const response = await fetch('/insert-step', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            des: det,
            rID: recipeID
        })
    });
    

    const responseData = await response.json();
    const messageElement = document.getElementById('addStepResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Step added successfully!";
        console.log("hi")
        fetchTableData();
    } else {
        messageElement.textContent = "Error adding step..";
    }    
}


function fetchTableData() {
    fetchAndDisplayTags()
    displayRecipe();
    displaySteps(); 
    fetchAndDisplayEquipment();   
    fetchAndDisplayIngredient(); 
}

window.onload = function() {
    checkDbConnection();
    document.getElementById('tagsForm').addEventListener("submit", insertTag); 
    document.getElementById('ingredientsForm').addEventListener("submit", insertIngredient); 
    document.getElementById('equipmentForm').addEventListener("submit", insertEquipment); 
    document.getElementById('addStepButton').addEventListener("click", addStep); 
    document.getElementById('viewDetailsButton').addEventListener('click', displayRecipe); 
    document.getElementById('searchStoreButton').addEventListener('click', fetchAndDisplayEquipmentByStore); 
    document.getElementById("updateRecipeForm").addEventListener("submit", updateRecipeTitle);
    document.getElementById("updateRecipeOwnerForm").addEventListener("submit", updateRecipeUser);
    document.getElementById("updateRecipeServingForm").addEventListener("submit", updateRecipeServings);
    document.getElementById("updateRecipeDescForm").addEventListener("submit", updateRecipeDesc);
    fetchTableData(); 
    
};






