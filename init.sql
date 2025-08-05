
drop table DEMOSRECIPE;
drop table registers;
drop table courseOne;
drop table courseTwo;
drop table FAVOURITES;
drop table hasTag;
drop table step;
drop table REVIEW;
drop table PROFESSIONALS_ONE;
drop table PROFESSIONALS_TWO;
drop table CONTAINSONE;
drop table CONTAINSTWO;
drop table INGREDIENT;
drop table tag;
drop table REQUIRESEQ;
drop table EQUIPMENT;
drop table RECIPE;
drop table USERS;


create table USERS (
	userID number primary key,
	email VARCHAR2(50) UNIQUE,
    uName VARCHAR2(50)
);

create table INGREDIENT (
	iName	VARCHAR2(30) PRIMARY KEY,
	type 	VARCHAR2(30)
);

create table PROFESSIONALS_ONE (
	YOE NUMBER PRIMARY KEY,
	rank VARCHAR2(10)
);

create table PROFESSIONALS_TWO (
	userID  NUMBER PRIMARY KEY,
	YOE NUMBER,
	speciality VARCHAR2(30), 
	FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE
);

create table RECIPE (
	rID NUMBER PRIMARY KEY, 
	title VARCHAR2(50),
	description VARCHAR2(500), 
	userID NUMBER NOT NULL, 
	servings NUMBER, 
	FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE
);

create table step (
	rID NUMBER,
	stepNumber NUMBER,
	image VARCHAR2 (50),
	description VARCHAR2 (500),
	PRIMARY KEY (rID, stepNumber),
	FOREIGN KEY (rID) REFERENCES recipe (rID) ON DELETE CASCADE
);

create table FAVOURITES (
	rID NUMBER, 
	userID NUMBER,
	PRIMARY KEY (rID, userID),
	FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE, 
	FOREIGN KEY (rID) REFERENCES RECIPE(rID) ON DELETE CASCADE
);

create table tag (
	tName VARCHAR2 (50) PRIMARY KEY,
	type VARCHAR2 (50)
);

create table hasTag (
	rID NUMBER,
	tName VARCHAR2 (30),
	PRIMARY KEY (rID, tName),
	FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE,
	FOREIGN KEY (tName) REFERENCES tag(tName) ON DELETE CASCADE
);

create table courseOne (
	teacherID NUMBER NOT NULL,
	duration NUMBER,
	difficulty VARCHAR2 (10),
	price NUMBER(5,2),
	PRIMARY KEY (teacherID, duration, difficulty),
	FOREIGN KEY (teacherID) REFERENCES PROFESSIONALS_TWO(userID) ON DELETE CASCADE
);

create table courseTwo (
	cID NUMBER PRIMARY KEY,
	cName VARCHAR2(30),
	teacherID NUMBER NOT NULL,
	duration NUMBER,
	difficulty VARCHAR(10),
	FOREIGN KEY (teacherID) REFERENCES PROFESSIONALS_TWO(userID) ON DELETE CASCADE
);

create table DEMOSRECIPE (
	rID NUMBER, 
	cID NUMBER,
	PRIMARY KEY (rID, cID),
	FOREIGN KEY (cID) REFERENCES courseTwo(cID) ON DELETE CASCADE, 
	FOREIGN KEY (rID) REFERENCES RECIPE(rID) ON DELETE CASCADE
);

create table registers (
	userID NUMBER,
	cID NUMBER,
	registryDate DATE,
	PRIMARY KEY (userID, cID),
	FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
	FOREIGN KEY (cID) REFERENCES courseTwo(cID) ON DELETE CASCADE
);

create table CONTAINSONE (
	iName	VARCHAR2(30),
	amount	VARCHAR2(30),
	cost 	NUMBER(5,2),
	PRIMARY KEY (iName, amount),
	FOREIGN KEY (iName) REFERENCES ingredient(iName)
);

create table CONTAINSTWO (
	iName	VARCHAR2(30),
	rID		NUMBER,
	amount	VARCHAR2(30),
	PRIMARY KEY (iName, rID),
	FOREIGN KEY (iName) REFERENCES ingredient(iName),
	FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE
);

create table EQUIPMENT (
	eName		VARCHAR2(50),
	whereToBuy	VARCHAR2(50),
	PRIMARY KEY (eName)
);

create table REQUIRESEQ (
	rID		NUMBER,
	eName	VARCHAR2(50),
	PRIMARY KEY (rID, eName),
	FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE,
	FOREIGN KEY (eName) REFERENCES equipment(eName)
);

create table REVIEW (
	reviewID	NUMBER,
	rID		NUMBER NOT NULL,
	userID		NUMBER NOT NULL,
	rating		NUMBER,
	commentBody	VARCHAR2(500),
	PRIMARY KEY (reviewID),
	UNIQUE (rID, userID), 
	FOREIGN KEY (rID) REFERENCES recipe(rID) ON DELETE CASCADE,
	FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

INSERT INTO users (userID, email, uName) VALUES (101, 'johnsmith@ubc.ca', 'John Smith');
INSERT INTO users (userID, email, uName) VALUES (102, 'maryjane@gmail.com', 'Mary Jane');
INSERT INTO users (userID, email, uName) VALUES (103, 'jpark@yahoo.ca', 'Jerry Park');
INSERT INTO users (userID, email, uName) VALUES (104, 'bobbuilder@ubc.ca', 'Bob Builder');
INSERT INTO users (userID, email, uName) VALUES (105, 'ssunnypatch@sfu.ca', 'Sarah Sunnypatch');
INSERT INTO users (userID, email, uName) VALUES (106, 'coolgirl@sfu.ca', 'Cool Person');
    

INSERT INTO ingredient (iName, type) VALUES ('corn', 'vegetable'); 
INSERT INTO ingredient (iName, type) VALUES ('macaroni', 'carbohydrate'); 
INSERT INTO ingredient (iName, type) VALUES ('chicken', 'protein'); 
INSERT INTO ingredient (iName, type) VALUES ('flour', 'baking'); 
INSERT INTO ingredient (iName, type) VALUES ('pepper', 'seasoning'); 
    

INSERT INTO PROFESSIONALS_ONE (YOE, rank) VALUES (1, 'Junior');
INSERT INTO PROFESSIONALS_ONE (YOE, rank) VALUES (2, 'Junior');
INSERT INTO PROFESSIONALS_ONE (YOE, rank) VALUES (5, 'Mid');
INSERT INTO PROFESSIONALS_ONE (YOE, rank) VALUES (6, 'Mid');
INSERT INTO PROFESSIONALS_ONE (YOE, rank) VALUES (10, 'Senior');

INSERT INTO PROFESSIONALS_TWO (userID, YOE, speciality) VALUES (101, 5, 'Italian cuisine');
INSERT INTO PROFESSIONALS_TWO (userID, YOE, speciality) VALUES (102, 10, 'Vegetarian recipes');
INSERT INTO PROFESSIONALS_TWO (userID, YOE, speciality) VALUES (103, 1, 'Greek cuisine');
INSERT INTO PROFESSIONALS_TWO (userID, YOE, speciality) VALUES (104, 2, 'Baker');
INSERT INTO PROFESSIONALS_TWO (userID, YOE, speciality) VALUES (105, 6, 'Asian cuisine');

INSERT INTO recipe (rID, title, description, userID, servings ) VALUES (101, 'Chocolate Chip Cookies', 'Moist and soft chocolate chip cookies.', 101, 10);
INSERT INTO recipe (rID, title, description, userID, servings ) VALUES (102, 'Mac and Cheese', 'Cheesey mac and cheese everyone will love.', 102, 4);
INSERT INTO recipe (rID, title, description, userID, servings ) VALUES (103, 'Veggie Stir-fry', 'Quick and healthy stir-fried vegetables.', 102, 2);
INSERT INTO recipe (rID, title, description, userID, servings ) VALUES (104, 'Spaghetti Bolognese', 'Classic Italian pasta with rich meat sauce', 103, 2);
INSERT INTO recipe (rID, title, description, userID, servings ) VALUES (105, 'Chocolate Cake', 'Decadent chocolate cake', 103, 10);

INSERT INTO favourites (rID, userID) VALUES (101, 102);
INSERT INTO favourites (rID, userID) VALUES (102, 101);
INSERT INTO favourites (rID, userID) VALUES (103, 101);
INSERT INTO favourites (rID, userID) VALUES (104, 102);
INSERT INTO favourites (rID, userID) VALUES (105, 101);
 

INSERT INTO step (rID, stepNumber, description , image) VALUES (102, 1, 'prepare the cheese', NULL);
INSERT INTO step (rID, stepNumber, description , image) VALUES (102, 2, 'prepare the mac', NULL);
INSERT INTO step (rID, stepNumber, description , image) VALUES (102, 3, 'mix them', NULL);
INSERT INTO step (rID, stepNumber, description , image) VALUES (101, 1, 'melt the chocolate', NULL);
INSERT INTO step (rID, stepNumber, description , image) VALUES (101, 2, 'put in in the oven', NULL);


INSERT INTO tag (tName, type) VALUES ('Italian', 'region');
INSERT INTO tag (tName, type) VALUES ('Pasta', 'dish');
INSERT INTO tag (tName, type) VALUES ('Vegetarian', 'diet');
INSERT INTO tag (tName, type) VALUES ('Dessert', 'course');
INSERT INTO tag (tName, type) VALUES ('Quick', 'time');

INSERT INTO hasTag (rID, tName) VALUES (104, 'Italian');
INSERT INTO hasTag (rID, tName) VALUES (104, 'Pasta');
INSERT INTO hasTag (rID, tName) VALUES (103, 'Vegetarian');
INSERT INTO hasTag (rID, tName) VALUES (103, 'Quick');
INSERT INTO hasTag (rID, tName) VALUES (101, 'Dessert');


INSERT INTO courseOne (teacherID, duration, difficulty, price) VALUES (101, 10, 'easy', 9.99);
INSERT INTO courseOne (teacherID, duration, difficulty, price) VALUES (102, 20, 'hard', 99.99);
INSERT INTO courseOne (teacherID, duration, difficulty, price) VALUES (103, 10, 'easy', 4.99);
INSERT INTO courseOne (teacherID, duration, difficulty, price) VALUES (104, 5, 'medium', 44.99);
INSERT INTO courseOne (teacherID, duration, difficulty, price) VALUES (105, 15, 'medium', 19.99);


INSERT INTO courseTwo (cID, cName, teacherID, duration, difficulty) VALUES (101, 'Desserts', 101, 10, 'easy');
INSERT INTO courseTwo (cID, cName, teacherID, duration, difficulty) VALUES (102, 'Meals for Students', 103, 10, 'easy');
INSERT INTO courseTwo (cID, cName, teacherID, duration, difficulty) VALUES (103, 'Everything Veggie', 102, 20, 'hard');
INSERT INTO courseTwo (cID, cName, teacherID, duration, difficulty) VALUES (104, 'A Nice Meal for a Nice Date', 105, 15, 'medium');
INSERT INTO courseTwo (cID, cName, teacherID, duration, difficulty) VALUES (105, 'Cook It and Learn It', 102, 20, 'hard');


INSERT INTO registers(userID, cID, registryDate) VALUES (101, 101, '1 aug 25');
INSERT INTO registers(userID, cID, registryDate) VALUES (102, 101, '1 aug 25');
INSERT INTO registers(userID, cID, registryDate) VALUES (101, 102, '2 aug 25');
INSERT INTO registers(userID, cID, registryDate) VALUES (103, 101, '3 aug 25');
INSERT INTO registers(userID, cID, registryDate) VALUES (101, 103, '3 aug 25');
INSERT INTO registers(userID, cID, registryDate) VALUES (102, 102, '3 aug 25');
INSERT INTO registers(userID, cID, registryDate) VALUES (101, 105, '3 aug 25');
INSERT INTO registers(userID, cID, registryDate) VALUES (101, 104, '3 aug 25');

INSERT INTO demosRecipe(rID, cID) VALUES (101, 101);
INSERT INTO demosRecipe(rID, cID) VALUES (105, 103);
INSERT INTO demosRecipe(rID, cID) VALUES (101, 102);
INSERT INTO demosRecipe(rID, cID) VALUES (105, 104);
INSERT INTO demosRecipe(rID, cID) VALUES (101, 104);


INSERT INTO containsOne (iName, amount, cost) VALUES ('flour', '30g', 2.11);
INSERT INTO containsOne (iName, amount, cost) VALUES ('corn', '1 cup', 4.50);
INSERT INTO containsOne (iName, amount, cost) VALUES ('macaroni', '2 cups', 5.00);
INSERT INTO containsOne (iName, amount, cost) VALUES ('chicken', '3 drumsticks', 9.50);
INSERT INTO containsOne (iName, amount, cost) VALUES ('pepper', '0.5 tsp', 1.00);


INSERT INTO containsTwo (rID, iName, amount) VALUES (101, 'flour', '50g');
INSERT INTO containsTwo (rID, iName, amount) VALUES (105, 'flour', '100g');
INSERT INTO containsTwo (rID, iName, amount) VALUES (103, 'corn', '1 cup');
INSERT INTO containsTwo (rID, iName, amount) VALUES (104, 'pepper', '1 tsp');
INSERT INTO containsTwo (rID, iName, amount) VALUES (102, 'macaroni', '1.5 cups');

INSERT INTO equipment (eName, whereToBuy) VALUES ('whisk', 'Ikea');
INSERT INTO equipment (eName, whereToBuy) VALUES ('handmixer', 'Home Depot');
INSERT INTO equipment (eName, whereToBuy) VALUES ('cast iron skillet', 'Ikea');
INSERT INTO equipment (eName, whereToBuy) VALUES ('mandolin', 'Canadian Tire');
INSERT INTO equipment (eName, whereToBuy) VALUES ('ladle', 'Ikea');
INSERT INTO equipment (eName, whereToBuy) VALUES ('spoon', 'Ikea');


INSERT INTO REQUIRESEQ (rID, eName) VALUES (104, 'mandolin');
INSERT INTO REQUIRESEQ (rID, eName) VALUES (101, 'handmixer');
INSERT INTO REQUIRESEQ (rID, eName) VALUES (105, 'whisk');
INSERT INTO REQUIRESEQ (rID, eName) VALUES (104, 'cast iron skillet');
INSERT INTO REQUIRESEQ (rID, eName) VALUES (101, 'ladle');
INSERT INTO REQUIRESEQ (rID, eName) VALUES (101, 'whisk');
INSERT INTO REQUIRESEQ (rID, eName) VALUES (101, 'spoon');


INSERT INTO review (reviewID, rID, userID, rating, commentBody) VALUES (101, 101, 102, 4, 'It was too sweet');
INSERT INTO review (reviewID, rID, userID, rating, commentBody) VALUES (102, 102, 103, 8, 'Easy and delicious');
INSERT INTO review (reviewID, rID, userID, rating, commentBody) VALUES (103, 103, 103, 4, 'It would be better with more salt');
INSERT INTO review (reviewID, rID, userID, rating, commentBody) VALUES (104, 101, 104, 9, 'Reminded me of the cookies my grandma made me');
INSERT INTO review (reviewID, rID, userID, rating, commentBody) VALUES (105, 104, 104, 10, 'I totally loved it');