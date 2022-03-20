USE employeesDB;

INSERT INTO department (department_name)
VALUES ("Sales");
INSERT INTO department (department_name)
VALUES ("Engineering");
INSERT INTO department (department_name)
VALUES ("Finance");
INSERT INTO department (department_name)
VALUES ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("John", "Doe", 1, 3);
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Mike", "Chan", 2, 1);
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Ashley", "Rodriguez", 3, null);
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Kevin", "Tupik", 4, 3);
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Malia", "Brown", 5, null);
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Sarah", "Lourd", 2, null);
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Tom", "Allen", 4, 7);
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Christian", "Eckenrode", 1, 2);