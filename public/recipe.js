
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
    const response = await fetch('/getrecipe', {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: rID
        })
        
    });

    const responseData = await response.json();
    const recipe = responseData.data[0];
    

    // Always clear old, already fetched data before new fetching process.
    recipeDisplay.innerHTML = ''; 

    
    const id = document.createElement('div'); 
    const name = document.createElement('div'); 
    const des = document.createElement('div');
    const creator = document.createElement('div');

    id.className = 'rid'; 
    id.innerHTML = 'ID: '  + recipe[0];
    
    
    name.className = 'rname'; 
    name.innerHTML = 'Name: '  + recipe[1];
    
    
    des.className = 'rdes'; 
    des.innerHTML = 'Description: '  + recipe[2];
    
    
    creator.className = 'rcreator'; 
    creator.innerHTML = 'Creator ID: '  + recipe[3];



    recipeDisplay.appendChild(id);
    recipeDisplay.appendChild(name);
    recipeDisplay.appendChild(des);
    recipeDisplay.appendChild(creator);



    
    
}
// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    displayRecipe();
    
};


