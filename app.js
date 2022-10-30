const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
//for password encryption
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "twitterClone.db");
let db = null;

const initializeDnAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  } catch (error) {
    console.log(`Database Error is ${error}`);
    process.exit(1);
  }
};

initializeDnAndServer();

//API
//REGISTER

app.post("/register/", async (request, response) => {
  const { username, password, name, gender } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const checkUserQuery = `select username from user where username = '${username}';`;
  const checkUserResponse = await db.get(checkUserQuery);
  if (checkUserResponse === undefined) {
    const createUserQuery = `
      insert into user(username, password, name, gender) 
      values('${username}','${hashedPassword}','${name}','${gender}');`;
    if (password.length > 6) {
      const createUser = await db.run(createUserQuery);
      response.status(200);
      response.send("User created successfully"); //Scenario 3
    } else {
      response.status(400);
      response.send("Password is too short"); //Scenario 2
    }
  } else {
    response.status(400);
    response.send(`User already exists`); //Scenario 1
  }
});

module.exports = app;
