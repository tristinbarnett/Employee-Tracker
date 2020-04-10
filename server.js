const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",
    password: "password",
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add departments",
                "Add roles",
                "Add employees",
                "View departments",
                "View roles",
                "View employees",
                "Update employee roles",
                "Exit"
            ]
        }).then(answer => {
            switch (answer.action) {
                case "Add departments":
                    addDepartments();
                    break;
                case "Add roles":
                    addRoles();
                    break;
                case "Add employees":
                    addEmployees();
                    break;
                case "View departments":
                    viewDepartments();
                    break;
                case "View roles":
                    viewRoles();
                    break;
                case "View employees":
                    viewEmployees();
                    break;
                case "Update employee roles":
                    updateRoles();
                    break;
                case "Exit":
                    break;
            }
        })
}

function addDepartments() {
    inquirer.prompt({
        name: "addDepartment",
        type: "input",
        message: "What department would you like to add?"
    }).then(answer => {
        let query = "INSERT INTO department (name) VALUES ?;";
        connection.query(query, answer.addDepartment, function (err, res) {
            console.log("Added department!")
            runSearch();
        });
    })
}

function addRoles() {
    inquirer.prompt([{
        name: "title",
        type: "input",
        message: "What is the title of the role you would like to add?"
    }, {
        name: "salary",
        type: "input",
        message: "What is the salary of this role?"
    }, {
        name: "department",
        type: "input",
        message: "What department do you want to assign this role to?"
    }]).then(answer => {
        let query = "SELECT id FROM department WHERE name = ?;";
        connection.query(query, answer.department, function (err, res) {
            let savedId = res.id;
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: savedId
                }, function (err, res) {
                    console.log("role has been added");
                    runSearch();
                })
        });
    })
}

function addEmployees() {
    inquirer.prompt([{
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
    },
    {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
    },
    {
        name: "role",
        type: "input",
        message: "What role will this employee have?"
    }]).then(answer => {

    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        const table = cTable.getTable('Departments', [res]);
        console.log(table);
    })
}

function viewRoles(){
    connection.query("SELECT * FROM role", function (err, res) {
        const table = cTable.getTable('Roles', [res]);
        console.log(table);
    })
}

function viewEmployees(){
    connection.query("SELECT * FROM employee", function (err, res) {
        const table = cTable.getTable('Employees', [res]);
        console.log(table);
    })
}

function updateRoles(){
    
}