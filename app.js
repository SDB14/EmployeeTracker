const inquirer = require("inquirer")
const consoletable = require("console.table")
const connection = require("./db/sqlconnection.js")

connection.connect(function () {

  questionprompt()
})

function questionprompt() {
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a new department",
        "Add a new role",
        "Add a new employee",
        // "Remove an employee",
        "Update employee roles",
        // "View the total utilized budget of a department",
        "Exit"
      ]
    }])
    .then(function (answer) {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a new department":
          addDepartment();
          break;
        case "Add a new role":
          addRole();
          break;
        case "Add a new employee":
          addEmployee();
          break;
        case "Update employee roles":
          updateRole();
          break;
        case "exit":
          connection.end();
          break;
      }
    });

}

function viewEmployees() {
  connection.query("SELECT * FROM Employee", function (err, res) {
    console.log(res)
    if (err) throw err
    console.table(res)
    questionprompt()
  })
}

function viewDepartments() {
  connection.query("SELECT * FROM Department", function (err, res) {
    console.log(res)
    if (err) throw err
    // console.table(res)
    questionprompt()
  })
}

function viewRoles() {
  connection.query("SELECT * FROM Role", function (err, result) {
    // console.log (result)
    if (err) throw err
    console.table(result)
    questionprompt()
  })
}

function addEmployee() {
  connection.query("SELECT * FROM Role", function (err, results) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the new employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the new employee's last name?"
      },
      {
        name: "roleId",
        type: "rawlist",
        choices: results.map(item => item.title),
        message: "Select a role for the employee"
      }
    ]).then(function (response) {
      const selectedRole = results.find(item => item.title === response.roleId);
      connection.query("INSERT INTO Employee SET ?",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: selectedRole.id
        }, function (err, res) {
          if (err) throw err;
          console.log("Added new employee named " + response.firstName + " " + response.lastName + "\n");
          questionprompt();
        })
    })
  })
}



    

// User choose the employee list, then employee is deleted

// function removeEmployee() {

//               inquirer.prompt([{

//                 type: "list",
//                 name: "EmployeeId",
//                 message: "Which employee do you want to remove?",
//                 choices: deleteEmployeeChoice
//               }
//               ])
//                 .then(function (response) {

//                   var query = `DELETE FROM Employee WHERE ?`;
//                   // when finished prompting, insert a new item into the db with that info
//                   connection.query(query, { id: response.employeeId }, function (err, res) {
//                     if (err) throw err;

//                     console.table(res);
//                     console.log(res.affectedRows + "Deleted!\n");

//                     questionprompt();
//                   });
//                 });
//             }

// const removeEmployee=()=>{
//   connection.query("SELECT * FROM Employee", function (err, results) {
//     if (err) throw err;
//     inquirer.prompt([{
//       name: `deleteEmployee`,
//             type: `list`,
//             message: `Choose the employee you want to remove.`,
//             choices: results.map(item => item.first_name)
//           },
//         ])
//            .then((response) => {
//                 const roleChosen = results.find(item => item.title === response.role_id)
//                 connection.query(
//                 "UPDATE Employee SET ? WHERE first_name = " + "'" + removeEmployee + "'", 
                
//                   function (err) {
//                     if (err) throw err;
//                     console.log("Successfully deleted " + removeEmployee + "!");
//                     questionprompt();
//                   }
//                 )
//               })
//           })
//         }

function addDepartment() {
          inquirer.prompt([
            {
              type: "input",
              name: "newdepartment",
              message: "Please add the new Department",
            }
          ]).then(function (response) {
            connection.query("INSERT INTO Department SET ?", {
              name: response.newdepartment
            }, function () {

              console.log("Department Added Successfully")
              questionprompt()
            })
          })


        }

function addRole() {
          connection.query("SELECT * FROM Department", function (err, result) {
            if (err) throw err;
            //asking for the three properties on the roles table
            inquirer.prompt([
              {
                name: "title",
                type: "input",
                message: "What is the title of the new role?"
              },
              {
                name: "salary",
                type: "number",
                message: "What is the salary of this position?",
              },
              {
                name: "deptId",
                type: "rawlist",
                message: "Select a department for this role",
                choices: result.map(item => item.name)
              }
            ]).then(function (response) {
              const selectedDept = result.find(dept => dept.name === response.deptId);
              connection.query("INSERT INTO Role SET ?",
                {
                  title: response.title,
                  salary: response.salary,
                  department_id: selectedDept.id
                },
                function (err, res) {
                  if (err) throw err;
                  console.log("New role added!\n");
                  questionprompt();
                }
              );
            });
          })
        }

  const updateRole = () => {
        connection.query("SELECT * FROM Employee", function (err, results) {
          if (err) throw err;
          inquirer.prompt([{
            name: `employeeUpdate`,
            type: `list`,
            message: `Choose the employee you want to update.`,
            choices: results.map(item => item.first_name)
          },
          ])
            .then((response) => {
              const updateEmployee = (response.employeeUpdate)
              connection.query("SELECT * FROM Role", function (err, results) {
                if (err) throw err;
                inquirer.prompt([
                  {
                    name: `role_id`,
                    type: `list`,
                    message: `Select a new role of the employee.`,
                    choices: results.map(item => item.title)
                  },
                ])
                  .then((response) => {
                    const roleChosen = results.find(item => item.title === response.role_id)
                    connection.query(
                      "UPDATE Employee SET ? WHERE first_name = " + "'" + updateEmployee + "'", {
                      role_id: "" + roleChosen.id + "",
                    },
                      function (err) {
                        if (err) throw err;
                        console.log("Successfully updated " + updateEmployee + "'s role to " + response.role_id + "!");
                        questionprompt();
                      }
                    )
                  })
              })
            })
        })
      }

      
//     connection.query("SELECT * FROM Role",function(err, result){
// // console.log (result)
//         if (err) throw err 
//        inquirer.prompt([
//            {
//                type:"input",
//                name: "firstname",
//                message: "Please enter the first name of the employee you would like to add"
//            },
//            {
//             type:"input",
//             name: "lastname",
//             message: "Please enter the last name of the employee you would like to add"
//         },
//         {
//             type: "list",
//             name:"roleid",
//             message:"Please select role for new employee",
//             choices:result.map(role=>role.title)        
//         }

//        ]).then(function(response){
//             const roletitle=result.find(role=>role.title===response.roleid)
//             const firstname=response.firstname
//             const lastname=response.lastname

//         connection.query("SELECT * FROM Employee",function(err, result){
//             // console.log (result)
//                     if (err) throw err 
//                  inquirer.prompt([
//                     {
//                         type: "list",
//                         name:"managerid",
//                         message:"Please select manager for new employee",
//                         choices:result.map(employee=>employee.firstname)        
//                     }

//                  ]).then(function(response){

//                     const manager=result.find(employee=>employee.firstname===response.managerid)

//                     connection.query("INSERT INTO Employee SET ?", {
//                         first_name:firstname,
//                         last_name:lastname,
//                         role_id:roletitle.id,
//                         manager_id:manager.id
//                     },function (err) {
//                         if (err) throw err;
//                         // console.log("Added Employee!");
//                       questionprompt();
//                  })
//                  })
//                 })

//        })
//     })