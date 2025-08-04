/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');
    const rDeleteBut = document.getElementById('delRec'); 
    const rDelFormDiv = document.getElementById('rDelFormDiv'); 
    const userDiv = document.getElementById('usersAllCoursesDiv'); 
    const usersInCoursesBut = document.getElementById('viewUs')
    // const rForm = document.getElementById('recipeFormDiv');
    // const recBut = document.getElementById('newRecBut'); 
    // const subBut = document.getElementById('submitRecipe')

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    rDeleteBut.addEventListener('click', () => (rDelFormDiv.style.display = "block")); 
    usersInCoursesBut.addEventListener('click', () => (userDiv.style.display = "block"));
    registerCourseButton.addEventListener('click', () => (registerFormDiv.style.display = "block"));

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
            window.open(window.location.href + 'recipe/' + recipe[0])
            // const recipeInfo = document.createElement('div');
            // recipeInfo.id = 'recipeInfo';
            // recipeInfo.innerHTML = recipe[1] + '<br>' + 'Description: ' + recipe[2] + '<br>' + recipe[4] + ' servings<br>';
            // recipeDisplay.appendChild(recipeInfo);
            // const ingredients = document.createElement('div');
        });
    })
}

async function fetchAndDisplayCourses() {
    
    const courseDisplay = document.getElementById('course-container');
    const response = await fetch('/courses', {
        method: 'GET'
    });

    const responseData = await response.json();
    const courses = responseData.data;
    // Always clear old, already fetched data before new fetching process.
    courseDisplay.innerHTML = '';
    courses.forEach(course => {
        const c = document.createElement('button');
        console.log(course); 
        c.className = 'cDiv';
        c.innerHTML = course[2]; 
        courseDisplay.appendChild(c);
        c.addEventListener('click', () => {
            const courseInfo = document.createElement('div');
            courseInfo.id = 'courseInfo';
            courseInfo.innerHTML = 'Course ID: ' + course[0] + '<br>' + 'Duration: ' 
            + course[3] + '<br>' + 'Difficulty: ' + course[4] + '<br>'+ 'Price: ' + course[5] + '<br>' + 'Recipe ID: ' + course[6];
            courseDisplay.appendChild(courseInfo);
        });
    });
}

async function fetchAndDisplayRegistrations() {
    const registrationDisplay = document.getElementById('register-container');
    const response = await fetch('/registrations', {
        method: 'GET'
    });
    const responseData = await response.json();
    const registrations = responseData.data;

    registrationDisplay.innerHTML = '';
    registrations.forEach(registration => {
        const r = document.createElement('div');
        r.className = 'rDiv';
        const registrationInfo = document.createElement('div');
        registrationInfo.className = 'registrationInfo';
        registrationInfo.innerHTML = 'User ID: ' + registration[0] + '<br>' + 'Course ID: ' + registration[1] + '<br>' + 'Date: ' + registration[2];
        r.appendChild(registrationInfo);
        registrationDisplay.appendChild(r);
    });
}


// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetAllTables() {

    const response = await fetch("/initiate-all-tables", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
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
        rDelFormDiv.style.display = "none"; 
        fetchTableData();
        document.getElementById('rID').value = ''; 
    } else {
        deleteMessageElement.textContent = "Error deleting recipe!";
    }

}

async function insertRegisterCourse(event) {
    event.preventDefault();
    const userID = document.getElementById('userRegID').value;
    const courseID = document.getElementById('courseRegID').value;
    const date = document.getElementById('dateRegID').value;

    const response = await fetch('/insert-register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userID,
            cID: courseID,
            date: date
        })
    });
    const responseData = await response.json(); 
    const messageElement = document.getElementById('registerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "You have registered for the course!";
        document.getElementById('courseID').value = ''; 
        fetchTableData();
    }
    else {
        messageElement.textContent = "Error registering for the course!";
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

// Inserts new course in course table
async function insertCourse(event) { 
    event.preventDefault();
    const courseRecipeID = document.getElementById('recipeCourseID').value;
    const titleValue = document.getElementById('courseTitleID').value;
    const durValue = document.getElementById('courseDurationID').value;
    const diffValue = document.getElementById('courseDifficultyID').value;
    const priceValue = document.getElementById('coursePriceID').value;
    const userId = document.getElementById('courseUserId').value;

    const response = await fetch('/insert-course', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rID: courseRecipeID,
            cID: Math.floor(Math.random() * 100) + 1,  
            cName: titleValue,
            teacherID: userId,  
            duration: durValue,
            difficulty: diffValue, 
            price: priceValue,
        })
    });
    
    const responseData = await response.json();
    const rmessageElement = document.getElementById('insertCourseResultMsg');

    if (responseData.success) {
        rmessageElement.textContent = "Course inserted successfully!";
        fetchTableData();
    } else {
        rmessageElement.textContent = "Error inserting course!!";
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.

async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

async function fetchAndDisplayUsersInAllCourses() {
    const usersInCoursesDisplay = document.getElementById('usersAllCourses');

    const response = await fetch('/usersinallcourses', {
        method: 'GET'
    });

    const responseData = await response.json();
    const userContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    usersInCoursesDisplay.innerHTML = ''; 

    userContent.forEach(user => {
        const tr = document.createElement('tr'); 
        const idCell = document.createElement("td"); 
        idCell.textContent = user[0]; 
        tr.appendChild(idCell); 

        usersInCoursesDisplay.appendChild(tr); 
    });
}

async function insertUser(event) { 
    event.preventDefault();
    const email = document.getElementById('emailID').value;
    const name = document.getElementById('usernameID').value;
    

    const response = await fetch('/insert-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            name: name
        })
    });
    const responseData = await response.json();
    const rmessageElement = document.getElementById('enterNewUserResultMsg');
    if (responseData.success) {
        let userId = responseData.userId;
        rmessageElement.textContent = "User inserted successfully! Your Id is " + userId;
        fetchTableData();
    } else {
        rmessageElement.textContent = "Error inserting User!!";
    }
}

async function insertPro(event) { 
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const YOE = document.getElementById('YOEId').value;
    const spec = document.getElementById('specialityId').value;

    

    const response = await fetch('/insert-pro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            YOE: YOE,
            spec: spec
        })
    });
    const responseData = await response.json();
    const rmessageElement = document.getElementById('enterNewProResultMsg');
    if (responseData.success) {
        rmessageElement.textContent = "Pro inserted successfully!";
        fetchTableData();
    } else {
        rmessageElement.textContent = "Error inserting User!!";
    }
}
// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetAllTables").addEventListener("click", resetAllTables);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById('submitRecipe').addEventListener("click", insertRecipe); 
    document.getElementById('submitCourse').addEventListener("click", insertCourse);
    document.getElementById('regCourseButton').addEventListener("click", insertRegisterCourse);
    document.getElementById('deleteRecipe').addEventListener("click", deleteRecipe); 
    document.getElementById('viewUs').addEventListener("click", fetchAndDisplayUsersInAllCourses()); 
    document.getElementById('enterNewUser').addEventListener("click", insertUser); 
    document.getElementById('enterNewPro').addEventListener("click", insertPro); 
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayRecipes(); 
    fetchAndDisplayCourses();
    fetchAndDisplayRegistrations();
    fetchAndDisplayUsersInAllCourses()
}
