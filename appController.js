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

router.post('/recipetags', async (req, res) => {
    const { rID } = req.body;
    const tableContent = await appService.fetchRecipeTagsFromDb(rID);
    res.json({data: tableContent});
});

router.post('/requireseq', async (req, res) => {
    const { rID } = req.body;
    const tableContent = await appService.fetchRecipeEquipmentFromDb(rID);
    res.json({data: tableContent});
});

router.post('/requireseqstore', async (req, res) => {
    const { rID, store } = req.body;
    const tableContent = await appService.fetchFilteredRecipeEquipmentFromDb(rID, store);
    res.json({data: tableContent});
}); 

router.post('/recipeingredients', async (req, res) => {
    const { rID } = req.body;
    const tableContent = await appService.fetchRecipeIngredientsFromDb(rID);
    res.json({data: tableContent});
});

router.get('/recipes', async (req, res) => {
    const tableContent = await appService.fetchRecipesFromDb();
    res.json({data: tableContent});
});

router.get('/courses', async (req, res) => {
    const tableContent = await appService.fetchCoursesFromDb();
    res.json({data: tableContent});
});

router.post('/getrecipe', async (req, res) => {
    const { rID, columns } = req.body;
    const recipe = await appService.fetchRecipe(rID, columns);
    res.json({data: recipe});
});

router.get('/usersinallcourses', async (req, res) => {
    const users = await appService.fetchUsersInAllCourses();
    res.json({data: users});
});


router.post('/getsteps', async (req, res) => {
    const { rID } = req.body;
    const recipe = await appService.fetchSteps(rID);
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

router.post("/insert-tag", async (req, res) => {
    try {
        const {type, tname, rID} = req.body;
        const tagResult = await appService.getTag(tname);
        if(tagResult.length === 0) {
            const insertResult = await appService.insertTag(tname, type);  // if tag doesn't exist in tags table, insert it
            if (!insertResult) {
                return res.status(500).json({ success: false }); 
            } 
        }
        // insert into has tag table 
        const insertResult = await appService.insertHasTag(rID, tname);
        if (insertResult) {
            res.json({ success: true});
        } else {
            return res.status(500).json({ success: false });
        }
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ success: false }); 
}});


router.post("/insert-ingredient", async (req, res) => {
    try {
        const {iName, iType, iAmount, iCost, rID} = req.body;
        const ingResult = await appService.getIngredient(iName);
        if(ingResult.length === 0) {
            const insertResult = await appService.insertIngredient(iName, iType);  // if ingredient doesn't exist in ingredients table, insert it
            if (!insertResult) {
                return res.status(500).json({ success: false }); 
            } 
        }
        // insert into contains one and contains two
        const insertResultOne = await appService.insertContainsOne(iName, iAmount, iCost); 
        if (!insertResultOne) {
            return res.status(500).json({ success: false });
        } 
        const insertResultTwo = await appService.insertContainsTwo(iName, rID, iAmount); 
        if (!insertResultTwo) {
            return res.status(500).json({ success: false });
        } 
        return res.json({success: true}); 
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ success: false }); 
}});


router.post("/insert-step", async (req, res) => {
    try {
        const {des, rID} = req.body;
        
        // insert into step table 
        const insertResult = await appService.insertStep(rID, des);
        if (insertResult) {
            res.json({ success: false});
        } else {
            res.status(500).json({ success: false });
        }
    } catch (err) {
        console.error(err); 
        res.status(500).json({ success: false }); 
}});

router.post("/insert-equipment", async (req, res) => {
try {
    const {eName, whereToBuy, rID} = req.body;
    const eqResult = await appService.getEq(eName);
    if(eqResult.length === 0) {
        const insertResult = await appService.insertEquipment(eName, whereToBuy)  // if equipment doesn't exist in equipment table, insert it
        if (!insertResult) {
            return res.status(500).json({ success: false }); 
        } 
    }
    // insert into requires table
    const insertResult = await appService.insertRequiresEq(rID,eName)
    if (insertResult) {
        res.json({ success: true });
    } else {
        return res.status(500).json({ success: false });
    }
} catch (err) {
    console.error(err); 
    return res.status(500).json({ success: false }); 
}});

router.post("/insert-course", async (req, res) => {
    try {
        const {rID, cID, cName, duration, difficulty, price } = req.body;

        const insertC1 = await appService.insertCourseOne(teacherID, duration, difficulty, price);
        if (!insertC1) {
            console.error("Error inserting course one");
            return res.status(500).json({ success: false });
        }
        const insertC2 = await appService.insertCourseTwo(cID, cName, teacherID, duration, difficulty);
        if (!insertC2) {
            console.error("Error inserting course two");
            res.status(500).json({ success: false });
        }
    
        const insertDemRec = await appService.insertDemosRecipe(rID, cID);
        if (!insertDemRec) {
            console.error("Error inserting demos recipe");
            return res.status(500).json({ success: false });
        }
        if (insertDemRec) {
            res.json({ success: true });
        } else {
            return res.status(500).json({ success: false });
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
