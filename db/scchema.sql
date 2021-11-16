    DROP DATABASE IF EXISTS employee_db;
    CREATE DATABASE employee_db;

    USE employee_db;

    CREATE TABLE Department(
        id INT auto_increment PRIMARY KEY,
        name VARCHAR(20) NOT NULL
    );
    CREATE TABLE Role(
        id INT auto_increment PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INT NOT NULL
    );
  CREATE TABLE Employee(
        id INT auto_increment PRIMARY KEY,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        role_id INT NOT NULL,
        manager_id INT
    );