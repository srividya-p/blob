const path = require('path')

const mysql = require('mysql')
const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
//const expressHbs = require('express-handlebars')

const viewRoute = require('./routes/student')
const connection = require('./connection')

const app = express()

publicDirPath = path.join(__dirname, '../blob-v1.0/public')
viewsPath = path.join(__dirname, '../blob-v1.0/templates/views')
const port = process.env.PORT || 3000

app.set('view engine', 'hbs')
app.set('views', viewsPath)

hbs.registerHelper('check', (val) => {
    if (val == 's_name'){
        return true;
    }
    else{
        return false;
    }
})

app.use(express.static(publicDirPath))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', viewRoute)

app.listen(port, () => {
    console.log('Server up and running on port ' + port + '...')
})
