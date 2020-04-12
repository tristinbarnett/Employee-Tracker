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
                    process.exit();
            }
        })
}

function addDepartments() {

    inquirer.prompt({
        name: "addDepartment",
        type: "input",
        message: "What department would you like to add?"
    }).then(answer => {
        let query = `INSERT INTO department (name) VALUES ("${answer.addDepartment}");`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            runSearch();
        });
    })
}

function addRoles() {
    const query = `SELECT name FROM department`;
    connection.query(query, function (err, res) {
        if (err) throw err;
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
            type: "list",
            message: "What department do you want to assign this role to?",
            choices: res
        }]).then(answer => {
            console.log(answer.department);
            const query = `SELECT id FROM department WHERE name = "${answer.department}";`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                const savedId = res[0].id;
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.title}", ${answer.salary}, ${savedId});`, function (err, res) {
                    runSearch();
                })
            });
        })
    });

}
function addEmployees() {
    const query = `SELECT title FROM role`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        let choicesArray = res.map(item => { return item.title });
        console.log(choicesArray);
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
            type: "list",
            message: "What role will this employee have?",
            choices: choicesArray
        }]).then(answer => {
            const firstName = answer.firstName;
            const lastName = answer.lastName;
            const query = `SELECT id FROM role WHERE title = "${answer.role}";`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                const savedId = res[0].id;
                const query = "SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee;";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    let choicesArray = res.map(item => { return item });
                    choicesArray.push({ name: "None" });
                    inquirer.prompt([{
                        name: "managerName",
                        type: "list",
                        message: "Who is this employee's manager?",
                        choices: choicesArray
                    }]).then(answer => {
                        if (answer.managerName === "None") {
                            connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${firstName}", "${lastName}", ${savedId});`, function (err, res) {
                                if (err) throw err;
                                runSearch();
                            })
                        } else {
                            const query = `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.managerName}";`;
                            connection.query(query, function (err, res) {
                                if (err) throw err;
                                console.log('res from select', res)
                                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${savedId}, ${res[0].id});`, function (err, res) {
                                    if (err) throw err;
                                    runSearch();
                                });
                            })
                        }
                    })
                });
            })
        })
    });
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function updateRoles() {
    connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee;`, function (err, res) {
        if (err) throw err;
        inquirer.prompt(
            {
                name: "employee",
                type: "list",
                message: "What employee do you want to update the role for?",
                choices: res
            }).then(answer => {
                connection.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.employee}";`, function (err, res) {
                    if (err) throw err;
                    const employeeId = res[0].id;
                    const query = `SELECT title FROM role`;
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        let choicesArray = res.map(item => { return item.title });
                        inquirer.prompt({
                            name: "newRole",
                            type: "list",
                            message: "What would you like to change their role to?",
                            choices: choicesArray
                        }).then(answer => {
                            const query = `SELECT id FROM role WHERE title = "${answer.newRole}";`;
                            connection.query(query, function (err, res) {
                                if (err) throw err;
                                const roleId = res[0].id;
                                const query = `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`
                                connection.query(query, function (err, res) {
                                    if (err) throw err;
                                    console.log("Updated Role!")
                                })
                            })
                        })
                    })
                })
            })
    });

}