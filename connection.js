const mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'college',
})


connection.connect((err) => {
    if (err) return console.log(err)

    console.log('Connected')
})

module.exports = connection