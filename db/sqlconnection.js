const mysql=require("mysql2")



const connection=mysql.createConnection({
port: 3306, 
user:"root",
password:"22Boot!2114",
database:"employee_db"


})


module.exports=connection