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

const userDiv = document.getElementById('usersAllCoursesDiv'); 
const usersInCoursesBut = document.getElementById('viewUs')
usersInCoursesBut.addEventListener('click', () => (userDiv.style.display = "block"));
registerCourseButton.addEventListener('click', () => (registerFormDiv.style.display = "block"));

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
        c.innerHTML = course[1] + '<br>' +" ID: " + course[0] + '<br>' + " Teacher: " + course[4] + '<br>' + "Difficulty: " + course[2] + '<br>' + " $" + Math.floor(course[3]);  
        courseDisplay.appendChild(c);

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
        r.className = 'regDiv';
        const registrationInfo = document.createElement('div');
        registrationInfo.className = 'registrationInfo';
        registrationInfo.innerHTML = 'User ID: ' + registration[0] + '<br>' + 'Course ID: ' + registration[1] + '<br>' + 'Date: ' + registration[2];
        r.appendChild(registrationInfo);
        registrationDisplay.appendChild(r);
    });
}

async function insertRegisterCourse(event) {
    event.preventDefault();
    const userID = document.getElementById('userRegID').value;
    const courseID = document.getElementById('courseRegID').value;
    const dateID = document.getElementById('dateRegID').value;

    const response = await fetch('/insert-register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userID,
            cID: courseID,
            registryDate: dateID
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
        rmessageElement.textContent = "Error inserting course - must be an instructor to post courses/teacherID does not exist.";
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

async function showRegNum(event) { 
    event.preventDefault();
    const courseDisplay = document.getElementById('course-num-container');

    const num = document.getElementById('regNum').value;
    
    const response = await fetch('/reg-courses-num', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            num: num
        })
    });
    const responseData = await response.json();
    const courses = responseData.data;
    
    courseDisplay.innerHTML = ''; 
    courses.forEach(course => {
        const c = document.createElement('button');
        c.className = 'cDiv';
        c.innerHTML = 'Course Number ' + course[0]; 
        courseDisplay.appendChild(c);
    });

}



async function countRegNum(event) { 
    event.preventDefault();
    const courseDisplay = document.getElementById('course-count-table');
    
    const response = await fetch('/count-reg-num', {
        method: "GET"
    });
    const responseData = await response.json();
    const courses = responseData.data;
    
    courseDisplay.innerHTML = ''; 
    courses.forEach(course => {
        const tr = document.createElement('tr'); 
        const courseCell = document.createElement("td"); 
        courseCell.textContent = course[0]; 
        const amountCell = document.createElement("td"); 
        amountCell.textContent = course[1]; 
        tr.appendChild(courseCell); 
        tr.appendChild(amountCell); 
        courseDisplay.appendChild(tr); 
    });

}

async function avgRegNum(event) { 
    event.preventDefault();
    const courseDisplay = document.getElementById('course-avg-table');
    
    const response = await fetch('/avgreg', {
        method: "GET"
    });
    const responseData = await response.json();
    const courses = responseData.data;
    
    courseDisplay.innerHTML = ''; 
    courses.forEach(course => {
        const tr = document.createElement('tr'); 
        const courseCell = document.createElement("td"); 
        courseCell.textContent = course[0]; 
        const amountCell = document.createElement("td"); 
        amountCell.textContent = course[1]; 
        tr.appendChild(courseCell); 
        tr.appendChild(amountCell); 
        courseDisplay.appendChild(tr); 
    });

}

window.onload = function() {
    checkDbConnection();
    fetchTableData();
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById('submitCourse').addEventListener("click", insertCourse);
    document.getElementById('regCourseButton').addEventListener("click", insertRegisterCourse);
    document.getElementById('viewUs').addEventListener("click", fetchAndDisplayUsersInAllCourses); 
    document.getElementById('submitRegNum').addEventListener("click", showRegNum); 
    document.getElementById('avgRegButton').addEventListener("click", avgRegNum); 
    document.getElementById('countRegButton').addEventListener("click", countRegNum); 
};

function fetchTableData() {
    fetchAndDisplayCourses();
    fetchAndDisplayRegistrations();
    fetchAndDisplayUsersInAllCourses()
}