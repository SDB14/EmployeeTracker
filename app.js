const inquirer=require("inquirer")
const consoletable=require("console.table")
const connection=require("./db/sqlconnection.js")

connection.connect(function(){

    questionprompt()
})

function questionprompt(){
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
            "Remove an employee",
            "Remove a role",
            "Remove a department",
            "Update employee roles",
            "View the total utilized budget of a department",
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
            case "Remove an employee":
              removeEmployee();
              break;
            case "Remove a role":
              removeRole();
              break;
            case "Remove a department":
                removeDepartment();
                break;
            case "Update employee roles":
              selectEmp();
              break;
            case "exit":
              connection.end();
              break;
          }
        });
        
}

function viewEmployees(){
    connection.query("SELECT * FROM Employee",function(err, res){
console.log (res)
        if (err) throw err 
        console.table(res)
        questionprompt()
    })
}

function viewDepartments(){
    connection.query("SELECT * FROM Department",function(err, res){
console.log (res)
        if (err) throw err 
        // console.table(res)
        questionprompt()
    })
}

function viewRoles(){
    connection.query("SELECT * FROM Role",function(err, result){
// console.log (result)
        if (err) throw err 
        console.table(result)
        questionprompt()
    })
}

function addEmployee(){
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
              console.log("Added new employee named " + answers.firstName + " " + answers.lastName + "\n");
              questionprompt();
            })
        })
      })
        
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
}

function addDepartment(){
    inquirer.prompt([
        {
            type:"input",
            name:"newdepartment",
            message:"Please add the new Department",
        }
    ]).then(function(response){
        connection.query("INSERT INTO Department SET ?",{
            name:response.newdepartment
        },function(){

            console.log("Department Added Successfully")
            questionprompt()
        })
    })


}