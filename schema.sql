DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	PRIMARY KEY(id)
);
CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
	PRIMARY KEY(id)
);
CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
	PRIMARY KEY(id)
);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Lucy", "Doxie", 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tristin", "Barnett", 1, 1);

INSERT INTO department (name) VALUES ("Marketing");
INSERT INTO department (name) VALUES ("IT");
INSERT INTO department (name) VALUES ("Finance");

INSERT INTO role (title, salary, department_id) VALUES ("Consultant", 60000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Marketing Lead", 85000, 1);

SELECT * FROM department;