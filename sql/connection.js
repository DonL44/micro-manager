const mysql = require("mysql2");
require("dotenv").config()

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "3Spacejam0",
    database: "employeesDB",

},
console.log("created connection")
)

module.exports = db