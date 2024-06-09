var mysql = require('mysql')
var pool = mysql.createConnection({
    user : 'root',
    password : 'Mysql12@#',
    host : 'localhost',
    database : 'todo',
    multipleStatements : true
})
module.exports = pool