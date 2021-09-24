var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'console.log(1)',
    port: 3306,
    database: 'test'
})

connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if(error) throw error;
//     console.log('The solution is: ', results[0].solution);
// })

var sql = 'SELECT * FROM websites;';

connection.query(sql, function(err, result) {
    if(err) {
        console.log('[SELECT ERROR] - ', err.message);
        return
    }

    console.log(result);
});