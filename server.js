const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
const db = require("./sql/connection.js");

// var db = mysql.createdb({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "~Ma009090",
//   database: "employeesDB"
// });

// connect to the mysql server and sql database
// db.connect(function (err) {
//   if (err) throw err;
//   // run the start function after the db is made to prompt the user
//   firstPrompt();
// });

// function which prompts the user for what action they should take
function firstPrompt() {

  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "View Employees by Department",
        // "View Employees by Manager",
        "Add Employee",
        "Remove Employees",
        "Update Employee roles",
        "Add roles",
        // "Remove roles",
        // "Update Employee Manager",
        "End"]
    })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;
        case "View Employees by Department":
          viewEmployeeByDepartment();
          break;
        // case "View Employees by Manager":
        //   viewEmployeeByManager();
        //   break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employees":
          removeEmployees();
          break;
        case "Update Employee roles":
          updateEmployeeroles();
          break;
        case "Add roles":
          addroles();
          break;
        // case "Remove roles":
        //   removeroles();
        //   break;

        // case "Update Employee MAnager":
        //   updateEmployeeManager();
        //   break;

        case "End":
          db.end();
          break;
      }
    });
}

//////////////////========================= 1."View Employees"/ READ all, SELECT * FROM

function viewEmployee() {
  console.log("Viewing employees\n");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN roles r
	ON e.roles_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`

  db.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Employees viewed!\n");
    firstPrompt();
  })
}

//========================================= 2."View Employees by Department" / READ by, SELECT * FROM

// Make a department array

function viewEmployeeByDepartment() {
  console.log("Viewing employees by department\n");

  var query =
    `SELECT d.id, d.department_name, r.salary AS budget
  FROM employee e
  LEFT JOIN roles r
	ON e.roles_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.department_name`

  db.query(query, function (err, res) {
    if (err) throw err;

    // const departmentChoices = res.map(({ id, name }) => ({
    //   name: `${id} ${name}`,
    //   value: id
    // }));

    const departmentChoices = res.map(data => ({
      value: data.id, name: data.name
    }));

    console.table(res);
    console.log("Department view succeed!\n");

    promptDepartment(departmentChoices);
  });
  // console.log(query.sql);
}

// User choose the department list, then employees pop up

function promptDepartment(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you choose?",
        choices: departmentChoices
      }
    ])
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department 
  FROM employee e
  JOIN roles r
	ON e.roles_id = r.id
  JOIN department d
  ON d.id = r.department_id
  WHERE d.id = ?`

      db.query(query, answer.departmentId, function (err, res) {
        if (err) throw err;

        console.table("response ", res);
        console.log(res.affectedRows + "Employees are viewed!\n");

        firstPrompt();
      });
    });
}

//========================================= 3."View Employees by Manager"



//========================================= 4."Add Employee" / CREATE: INSERT INTO

// Make a employee array

function addEmployee() {
  console.log("Inserting an employee!")

  var query =
    `SELECT r.id, r.title, r.salary 
      FROM roles r`

  db.query(query, function (err, res) {
    if (err) throw err;

    const rolesChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("rolesToInsert!");

    promptInsert(rolesChoices);
  });
}

function promptInsert(rolesChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
        
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "rolesId",
        message: "What is the employee's roles?",
        choices: rolesChoices
      },
      {
        name: "manager_id",
        type: "list",
        message: "What is the employee's manager_id?",
        choices: manager
      }
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO employee SET ?`
      // when finished prompting, insert a new item into the db with that info
      db.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          roles_id: answer.rolesId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "Inserted successfully!\n");

          firstPrompt();
        });
      // console.log(query.sql);
    });
}

//========================================= 5."Remove Employees" / DELETE, DELETE FROM

// Make a employee array to delete

function removeEmployees() {
  console.log("Deleting an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  db.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteEmployeeChoices);
  });
}

// User choose the employee list, then employee is deleted

function promptDelete(deleteEmployeeChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: deleteEmployeeChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM employee WHERE ?`;
      // when finished prompting, insert a new item into the db with that info
      db.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        firstPrompt();
      });
      // console.log(query.sql);
    });
}

//========================================= 6."Update Employee roles" / UPDATE,

function updateEmployeeroles() { 
  employeeArray();

}

function employeeArray() {
  console.log("Updating an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN roles r
	ON e.roles_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`

  db.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));

    console.table(res);
    console.log("employeeArray To Update!\n")

    rolesArray(employeeChoices);
  });
}

function rolesArray(employeeChoices) {
  console.log("Updating an roles");

  var query =
    `SELECT r.id, r.title, r.salary 
  FROM roles r`
  let rolesChoices;

  db.query(query, function (err, res) {
    if (err) throw err;

    rolesChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));

    console.table(res);
    console.log("rolesArray to Update!\n")

    promptEmployeeroles(employeeChoices, rolesChoices);
  });
}

function promptEmployeeroles(employeeChoices, rolesChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set with the roles?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "rolesId",
        message: "Which roles do you want to update?",
        choices: rolesChoices
      },
    ])
    .then(function (answer) {

      var query = `UPDATE employee SET roles_id = ? WHERE id = ?`
      // when finished prompting, insert a new item into the db with that info
      db.query(query,
        [ answer.rolesId,  
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          firstPrompt();
        });
      // console.log(query.sql);
    });
}



//////////////////========================= 7."Add roles" / CREATE: INSERT INTO

function addroles() {

  var query =
    `SELECT d.id, d.department_name, r.salary AS budget
    FROM employee e
    JOIN roles r
    ON e.roles_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.department_name`

  db.query(query, function (err, res) {
    if (err) throw err;

    // (callbackfn: (value: T, index: number, array: readonly T[]) => U, thisArg?: any)
    const departmentChoices = res.map(({ id, department_name }) => ({
      value: id, department_name: `${id} ${department_name}`
    }));

    console.table(res);
    console.log("Department array!");

    promptAddroles(departmentChoices);
  });
}

function promptAddroles(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "rolesTitle",
        message: "roles title?"
      },
      {
        type: "input",
        name: "rolesSalary",
        message: "roles Salary"
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: departmentChoices
      },
    ])
    .then(function (answer) {

      var query = `INSERT INTO roles SET ?`

      db.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.departmentId
      },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("roles Inserted!");

          firstPrompt();
        });

    });
}
firstPrompt();

//========================================= 8."Remove roles"