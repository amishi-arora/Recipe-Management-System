const express = require('express');
const appService = require('./appService');
const path = require('path');

const router = express.Router();


// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/recipes', async (req, res) => {
    const tableContent = await appService.fetchRecipesFromDb();
    res.json({data: tableContent});
});

router.get('/courseTwo', async (req, res) => {
    const tableContent = await appService.fetchCoursesFromDb();
    res.json({data: tableContent});
});

router.post('/getrecipe', async (req, res) => {
    const { rID } = req.body;
    const recipe = await appService.fetchRecipe(rID);
    res.json({data: recipe});
});

router.get('/recipe/:id', async (req, res) => {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
      return res.status(400).send('Invalid ID');
    }
  
    res.sendFile('recipe.html', { root: path.join(__dirname, 'public') });
});

router.post("/initiate-all-tables", async (req, res) => {
    const initiateResult = await appService.initiateAllTables();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-recipe", async (req, res) => {
    const { rID } = req.body;
    const deleteResult = await appService.deleteRecipe(rID); 
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-recipe", async (req, res) => {
    try {
    const {title, description, servings } = req.body; // removed rID from here as it wasn't being used
    const userID = 1; //hardcoded for now (will fix later)
    const insertResult = await appService.insertRecipe(title, description, userID,  servings);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
    } catch (err) {
        console.error("error", err); 
        res.status(500).json({ success: false });
    }
});

router.post("/insert-course", async (req, res) => {
    try {
    const {cName, duration, difficulty } = req.body;
    const teacherID = 100; // change
    const cID = 100; // change
    const insertResult = await appService.insertCourseTwo(cID, cName, teacherID, duration, difficulty);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
    } catch (err) {
        console.error("error", err); 
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


module.exports = router;
