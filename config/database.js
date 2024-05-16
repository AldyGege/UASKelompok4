const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'kelas_online'
});

connection.connect(function(error) {
    if(error) {
        console.log(error);
    } else {
        console.log('Connection Success');
    }
});

module.exports = connection;
