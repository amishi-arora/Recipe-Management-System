const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');
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

async function fetchRecipeIngredientsFromDb(rID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT c2.iName, c2.amount, c1.cost
             FROM containsTwo c2, containsOne c1
             WHERE c2.iName = c1.iName and c2.rID = :rID`, [rID]);
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

async function fetchCoursesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM courseTwo');
        return result.rows;
    }).catch(() => {
        return []; 
    });
}

async function fetchRecipe(rID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RECIPE WHERE rID = :rID', [rID]);
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
            await connection.execute(`DROP TABLE DEMOSRECIPE`);
        } catch(err) {
            console.log('Table DEMOSRECIPE might not exist, proceeding to create...');
        }
        
        
        try {
            await connection.execute(`DROP TABLE registers`);
        } catch(err) {
            console.log('Table registers might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE courseOne`);
        } catch(err) {
            console.log('Table courseOne might not exist, proceeding to create...');
        }
        
        try {
            await connection.execute(`DROP TABLE courseTwo`);
        } catch(err) {
            console.log('Table courseTwo might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE FAVOURITES`);
        } catch(err) {
            console.log('Table FAVOURITES might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE hasTag`);
        } catch(err) {
            console.log('Table hasTag might not exist, proceeding to create...');
        }
        
        try {
            await connection.execute(`DROP TABLE step`);
        } catch(err) {
            console.log('Table step  might not exist, proceeding to create...');
        }
        try {  
            await connection.execute(`DROP TABLE REVIEW`);
        } catch(err) {  
            console.log('Table REVIEW might not exist, proceeding to create...');
        }
        
        try {
            await connection.execute(`DROP TABLE PROFESSIONALS_ONE`);
        } catch(err) {
            console.log('Table PROFESSIONALS_ONE might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE PROFESSIONALS_TWO`);
        } catch(err) {
            console.log('Table PROFESSIONALS_TWO might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE CONTAINSONE`);
        } catch(err) {
            console.log('Table CONTAINSONE might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE CONTAINSTWO`);
        } catch(err) {
            console.log('Table CONTAINSTWO might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE INGREDIENT`);
        } catch(err) {
            console.log('Table INGREDIENT might not exist, proceeding to create...');
        }
        
        
        try {
            await connection.execute(`DROP TABLE tag`);
        } catch(err) {
            console.log('Table tag might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE REQUIRESEQ`);
        } catch(err) {
            console.log('Table REQUIRESEQ might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE EQUIPMENT`);
        } catch(err) {
            console.log('Table EQUIPMENT might not exist, proceeding to create...');
        }
        
        try {
            await connection.execute(`DROP TABLE RECIPE`);
        } catch(err) {
            console.log('Table RECIPE might not exist, proceeding to create...');
        }
        try {
            await connection.execute(`DROP TABLE USERS`);
        } catch(err) {
            console.log('Table USERS might not exist, proceeding to create...');
        }
        await connection.execute(`
            CREATE TABLE USERS (
                userID  NUMBER PRIMARY KEY,
                email VARCHAR2(50) UNIQUE,
                uName VARCHAR2(50)
            )
        `);
        
        await connection.execute(`
            CREATE TABLE INGREDIENT (
                iName	VARCHAR2(30) PRIMARY KEY,
                type 	VARCHAR2(30)
            )
        `);
        
        await connection.execute(`
            CREATE TABLE PROFESSIONALS_ONE (
                YOE NUMBER PRIMARY KEY,
                rank VARCHAR2(10) 
            )
        `);
        await connection.execute(`
            CREATE TABLE PROFESSIONALS_TWO (
                userID  NUMBER PRIMARY KEY,
                YOE NUMBER,
                speciality VARCHAR2(30), 
                FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE
            )
        `);
        
        
        await connection.execute(`
            CREATE TABLE RECIPE (
                rID NUMBER PRIMARY KEY, 
                title VARCHAR2(50),
                description VARCHAR2(500), 
                userID NUMBER NOT NULL, 
                servings NUMBER, 
                FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE
             )
        `);
        await connection.execute(`
            CREATE TABLE step (
            rID NUMBER,
            stepNumber NUMBER,
            image VARCHAR2 (50),
            description VARCHAR2 (500),
            PRIMARY KEY (rID, stepNumber),
            FOREIGN KEY (rID) REFERENCES recipe (rID) ON DELETE CASCADE
            )
        `);
        
        await connection.execute(`
            CREATE TABLE FAVOURITES (
                rID NUMBER, 
                userID NUMBER,
                PRIMARY KEY (rID, userID),
                FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE, 
                FOREIGN KEY (rID) REFERENCES RECIPE(rID) ON DELETE CASCADE
             )
        `);
        await connection.execute(`
            CREATE TABLE tag (
                tName VARCHAR2 (50) PRIMARY KEY,
                type VARCHAR2 (50)
                )
        `);
        
        await connection.execute(`
            CREATE TABLE hasTag (
                rID NUMBER,
                tName VARCHAR2 (30),
                PRIMARY KEY (rID, tName),
                FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE,
                FOREIGN KEY (tName) REFERENCES tag(tName) ON DELETE CASCADE 
                )
        `);
        
        await connection.execute(`
            CREATE TABLE courseOne (
                teacherID NUMBER NOT NULL,
                duration NUMBER,
                difficulty VARCHAR2 (10),
                price NUMBER(5,2),
                PRIMARY KEY (teacherID, duration, difficulty),
                FOREIGN KEY (teacherID) REFERENCES PROFESSIONALS_TWO(userID) ON DELETE CASCADE
                )
        `);
        
        
        await connection.execute(`
            CREATE TABLE courseTwo (
                cID NUMBER PRIMARY KEY,
                cName VARCHAR2(30),
                teacherID NUMBER NOT NULL,
                duration NUMBER,
                difficulty VARCHAR(10),
                FOREIGN KEY (teacherID) REFERENCES PROFESSIONALS_TWO(userID) ON DELETE CASCADE
                )
        `);
        
        await connection.execute(`
            CREATE TABLE DEMOSRECIPE (
                rID NUMBER, 
                cID NUMBER,
                PRIMARY KEY (rID, cID),
                FOREIGN KEY (cID) REFERENCES courseTwo(cID) ON DELETE CASCADE, 
                FOREIGN KEY (rID) REFERENCES RECIPE(rID) ON DELETE CASCADE
             )
        `);
        
        await connection.execute(`
            CREATE TABLE registers (
                userID NUMBER,
                cID NUMBER,
                registryDate DATE,
                PRIMARY KEY (userID, cID),
                FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
                FOREIGN KEY (cID) REFERENCES courseTwo(cID) ON DELETE CASCADE
                )
        `);
        await connection.execute(`
            CREATE TABLE CONTAINSONE (
                iName	VARCHAR2(30),
                amount	VARCHAR2(30),
                cost 	NUMBER(5,2),
                PRIMARY KEY (iName, amount),
                FOREIGN KEY (iName) REFERENCES ingredient(iName)
            )
        `);
        await connection.execute(`
            CREATE TABLE CONTAINSTWO (
                iName	VARCHAR2(30),
                rID		NUMBER,
                amount	VARCHAR2(30),
                PRIMARY KEY (iName, rID),
                FOREIGN KEY (iName) REFERENCES ingredient(iName),
                FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE
            )
        `);
        await connection.execute(`
            CREATE TABLE EQUIPMENT (
                eName		VARCHAR2(50),
                whereToBuy	VARCHAR2(50),
                PRIMARY KEY (eName)
            )
        `);
        await connection.execute(`
            CREATE TABLE REQUIRESEQ (
                rID		NUMBER,
                eName	VARCHAR2(50),
                PRIMARY KEY (rID, eName),
                FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE,
                FOREIGN KEY (eName) REFERENCES equipment(eName)
            )
        `);
        await connection.execute(`
            CREATE TABLE REVIEW (
                reviewID	NUMBER,
                rID		NUMBER NOT NULL,
                userID		NUMBER NOT NULL,
                rating		NUMBER,
                commentBody	VARCHAR2(500),
                PRIMARY KEY (reviewID),
                UNIQUE (rID, userID), 
                FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE,
                FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
            )
        `);
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
async function insertUser(userID, email, uName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO USERS (userId, email, uName) VALUES (:userId, :email, :uName)`,
            [userId, email, uName],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
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

async function insertRegisters(uID, cID, date) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO registers (uID, cID, date) VALUES (:uID, :cID, :date)`,
            [uID, cID, date],
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
    insertCourseTwo,
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
    insertIngredient, 
    getIngredient, 
    fetchRecipeIngredientsFromDb
};