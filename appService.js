const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');
const fs = require('fs').promises;
// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};
// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}
async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
initializeConnectionPool();
process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);
// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}
async function fetchRecipesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RECIPE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchRecipeTagsFromDb(rID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM hasTag WHERE rID = :rID', [rID]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function recipeFilter(titleCon, fil1, fil2, serLess, serMore) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM RECIPE WHERE title LIKE '%${titleCon}%' ${fil1} servings > ${serMore} ${fil2} servings < ${serLess} `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function courseRegNum(num) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT cID, count(userID)
            FROM REGISTERS 
            GROUP BY cID
            HAVING COUNT(userID) > ${num}
            `); 
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchUsersInAllCourses() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userID FROM USERS u
            WHERE NOT EXISTS (
                SELECT c.cID FROM courseTwo c
                MINUS
                SELECT r.cID FROM registers r WHERE r.userID = u.userID )`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchRecipeIngredientsFromDb(rID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT c2.iName, c2.amount, c1.cost
             FROM containsTwo c2, containsOne c1
             WHERE c2.iName = c1.iName and c2.amount = c1.amount and c2.rID = :rID`, [rID]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function fetchRecipeEquipmentFromDb(rID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
           `SELECT r.eName, e.whereToBuy
            FROM REQUIRESEQ r, EQUIPMENT e
            WHERE rID = :rID and r.eName = e.eName`, [rID]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchFilteredRecipeEquipmentFromDb(rID, store) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
           `SELECT r.eName, e.whereToBuy
            FROM REQUIRESEQ r, EQUIPMENT e
            WHERE rID = :rID and r.eName = e.eName and whereToBuy = :store `, [rID, store]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCoursesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT c2.cID, c2.teacherID, c2.cName, c2.duration, c2.difficulty, c1.price, dr.rID
            FROM courseOne c1, courseTwo c2, demosRecipe dr
            WHERE c1.teacherID = c2.teacherID and c1.duration = c2.duration and c1.difficulty = c2.difficulty and c2.cID = dr.cID`);
        return result.rows;
    }).catch(() => {
        return []; 
    });
}

async function fetchRegistrations() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * FROM REGISTERS r, USERS u, courseTwo c
            WHERE r.userID = u.userID and r.cID = c.cID`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchRecipe(rID, columns) {
    columnString = columns.join(', '); 
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT ${columnString} FROM RECIPE WHERE rID = :rID`, [rID]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchSteps(rID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM STEP WHERE rID = :rID', [rID]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateAllTables() {
    return await withOracleDB(async (connection) => {
// -----------Arshia: let's keep it for our refrence-----------
        // try {
        //     await connection.execute(`DROP TABLE DEMOTABLE`);
        // } catch(err) {
        //     console.log('Table might not exist, proceeding to create...');
        // }
        // const result = await connection.execute(`
        //     CREATE TABLE DEMOTABLE (
        //         id NUMBER PRIMARY KEY,
        //         name VARCHAR2(20)
        //     )
        // `);
// --------------------------------------
        try {

            // const sqlScript = await fs.readFile('init.sql', 'utf8');
            // const result = await connection.execute(sqlScript);
            const sqlScript = await fs.readFile('init.sql', 'utf8');

            // Split the script into individual statements (basic example, may need refinement for complex scripts)
            // This example assumes statements are separated by semicolons and handles empty lines
            const statements = sqlScript.split(';').map(s => s.trim()).filter(s => s.length > 0);

            // Execute each statement
            for (const statement of statements) {
                console.log(`Executing: ${statement}`); // Log a snippet
                await connection.execute(statement);
            }
            connection.commit();
        } catch (err) {
            console.error("Error executing SQL script:", err);
        }
        return true;
    }).catch(() => {
        return false;
    });
}
async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error(err); 
        return false;
    });
}
async function insertUser(email, uName) {

    
    return await withOracleDB(async (connection) => {
        let userId;
        const resultID = await connection.execute('SELECT MAX (userID) FROM USERS');
        currID = resultID.rows[0][0];
        if (currID === null) userId = 101;
        else userId = currID + 1;

        const result = await connection.execute(
            `INSERT INTO USERS (userId, email, uName) VALUES (:userId, :email, :uName)`,
            [userId, email, uName],
            { autoCommit: true }
        );
        return userId;
    }).catch(() => {
        return false;
    });
}
async function insertProfessionalOne(YOE, rank) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PROFESSIONALS_ONE (YOE, rank) VALUES (:YOE, :rank)`,
            [YOE, rank],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertProfessionalTwo(userID, YOE, speciality) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO PROFESSIONALS_TWO (userID, YOE, speciality) VALUES (:userID, :YOE, :speciality)`,
            [userID, YOE, speciality],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertRecipe(title, description, userID, servings) {
    return await withOracleDB(async (connection) => {

        let rID;
        const resultID = await connection.execute('SELECT MAX (rID) FROM RECIPE');
        currID = resultID.rows[0][0];
        if (currID === null) rID = 101;
        else rID = currID + 1;

        const result = await connection.execute(
            `INSERT INTO RECIPE (rID, title, description, userID, servings) VALUES (:rID, :title, :description, :userID, :servings)`,
            [rID, title, description, userID, servings],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.log(err); 
        return false;
    });
}
async function insertFavourites(rID, userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO FAVOURITES (rID, userID) VALUES (:rID, :userID)`,
            [rID, userID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertDemosRecipe(rID, cID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOSRECIPE (rID, cID) VALUES (:rID, :cID)`,
            [rID, cID],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertIngredient(iName, type) {
    return await withOracleDB(async (connection) => { 
        const result = await connection.execute(
            `INSERT INTO INGREDIENT (iName, type) VALUES (:iName, :type)`,
            [iName, type],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertContainsOne(iName, amount, cost) {
    return await withOracleDB(async (connection) => { 
        const result = await connection.execute(
            `INSERT INTO CONTAINSONE (iName, amount, cost) VALUES (:iName, :amount, :cost)`,
            [iName, amount, cost],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertContainsTwo(iName, rID, amount) {
    return await withOracleDB(async (connection) => {   
        const result = await connection.execute(
            `INSERT INTO CONTAINSTWO (iName, rID, amount) VALUES (:iName, :rID, :amount)`,
            [iName, rID, amount],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertEquipment(eName, whereToBuy) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO EQUIPMENT (eName, whereToBuy) VALUES (:eName, :whereToBuy)`,
            [eName, whereToBuy],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertRequiresEq(rID, eName) {
    return await withOracleDB(async (connection) => { 
        const result = await connection.execute(
            `INSERT INTO REQUIRESEQ (rID, eName) VALUES (:rID, :eName)`,
            [rID, eName],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}
async function insertReview(reviewID, rID, userID, rating, comment) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO REVIEW (reviewID, rID, userID, rating, comment) VALUES (:reviewID, :rID, :userID, :rating, :comment)`,
            [reviewID, rID, userID, rating, comment],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertHasTag(rID, tName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO hasTag (rID, tName) VALUES (:rID, :tName)`,
            [rID, tName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertTag(tName, type) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO tag (tName, type) VALUES (:tName, :type)`,
            [tName, type],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertCourseOne(teacherID, duration, difficulty, price) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO courseOne (teacherID, duration, difficulty, price) VALUES (:teacherID, :duration, :difficulty, :price)`,
            [teacherID, duration, difficulty, price],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertCourseTwo(cID, cName, teacherID, duration, difficulty) {
    return await withOracleDB(async (connection) => {
        let cID;
        const resultID = await connection.execute('SELECT MAX (cID) FROM COURSETWO');
        currID = resultID.rows[0][0];
        if (currID === null) cID = 101;
        else cID = currID + 1;

        const result = await connection.execute(
            `INSERT INTO courseTwo (cID, cName, teacherID, duration, difficulty) VALUES (:cID, :cName, :teacherID, :duration, :difficulty)`,
            [cID, cName, teacherID, duration, difficulty],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertRegisters(userID, cID, registryDate) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO registers (userID, cID, registryDate) VALUES (:userID, :cID, TO_DATE(:registryDate, 'YYYY-MM-DD'))`,
            {userID, cID, registryDate},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertStep(rID, description , image=null) {

    return await withOracleDB(async (connection) => {

        let stepNumber;
        const resultN = await connection.execute('SELECT MAX (stepNumber) FROM STEP WHERE rID = :rID', [rID]);
        currN = resultN.rows[0][0];
        if (currN === null) stepNumber = 1;
        else stepNumber = currN + 1;

        const result = await connection.execute(
            `INSERT INTO STEP (rID,  stepNumber, description , image) VALUES (:rID, :stepNumber, :description, :image)`,
            [rID,  stepNumber, description , image],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateTitle(oldTitle, newTitle) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE RECIPE SET title=:newTitle where title=:oldTitle`,
            [newTitle, oldTitle],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function getCourse(cID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM courseTwo WHERE cID = :cID`, 
            [cID], 
            {autoCommit: true}
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getTag(tname) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM TAG WHERE tName = :tname`, 
            [tname], 
            {autoCommit: true}
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getIngredient(iName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM INGREDIENT WHERE iName = :iName`, 
            [iName], 
            {autoCommit: true}
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getEq(ename) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM EQUIPMENT WHERE eName = :ename`, 
            [ename], 
            {autoCommit: true}
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function deleteRecipe(rID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM RECIPE WHERE rID = :rID`,
            [rID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    testOracleConnection,
    insertRecipe,
    deleteRecipe, 
    insertCourseOne,
    insertCourseTwo,
    insertRegisters,
    fetchRegistrations,
    fetchDemotableFromDb,
    fetchRecipesFromDb,
    fetchCoursesFromDb,
    initiateAllTables, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    fetchRecipe,
    getTag, 
    insertTag, 
    insertHasTag, 
    fetchRecipeTagsFromDb,
    fetchSteps,
    insertEquipment,
    insertRequiresEq,
    getEq, 
    fetchRecipeEquipmentFromDb,
    insertStep,
    insertContainsOne, 
    insertContainsTwo, 
    insertDemosRecipe,
    getCourse,
    insertIngredient, 
    getIngredient, 
    fetchRecipeIngredientsFromDb, 
    fetchFilteredRecipeEquipmentFromDb, 
    fetchUsersInAllCourses,
    insertUser,
    insertProfessionalOne,
    insertProfessionalTwo,
    recipeFilter,
    updateTitle,
    courseRegNum,
};