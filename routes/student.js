const fs = require('fs')

const express = require('express')
const urlParser = require('url')

const connection = require('../connection')

const router = express.Router()

var base64 = new Array()

router.get('/', (req, res) => {
    connection.query('SELECT * FROM student', (err, results, feilds) => {
        if (err) return console.log(err)

        for (var i = 0; i < results.length; i++) {
            base64.push(Buffer.from(results[i].image).toString('base64'))
            results[i].image = null
        }

        res.render('view', {
            result: results,
            hex: encodeURIComponent(JSON.stringify(base64)),
            title: 'View'
        })
        base64 = []
    })
})

router.get('/insert', (req, res) => {
    res.render('insert', {
        title: 'Insert'
    })
})

router.post('/insert/inserted', (req, res) => {
    var id = req.body.id
    var s_name = req.body.s_name
    var path = req.body.path
    var sql1 = 'INSERT INTO student VALUES(' + id + ',\'' + s_name + '\' ,load_file(\'/home/pika/Desktop/' + path + '\'))'
    connection.query(sql1, (err, results) => {
        if (err) return res.send(err)
        res.send({
            message: "Record inserted successfully!",
            query: sql1
        })
    })

    var sql2 = 'INSERT INTO paths VALUES(' + id + ',\'/home/pika/Desktop/' + path + '\')'
    connection.query(sql2, (err, results) => {
        if (err) return console.log(err)
    })

})

router.get('/delete', (req, res) => {
    res.render('delete', {
        title: 'Delete'
    })
})

router.post('/delete/deleted', (req, res) => {
    var id = req.body.id
    var sql = 'DELETE FROM student WHERE id=' + id
    connection.query(sql, (err, results) => {
        if (err) return res.send(err)
        if(results.affectedRows ==0) return res.send({
                message: "Record Not Found!"
            })
        res.send({
            message: "Record deleted successfully!",
            query: sql
        })
    })
})

router.get('/search', (req, res) => {
    res.render('search', {
        title: 'Update'
    })
})
var oldId;
var oldPath;
router.get('/update', (req, res) => {
    var urlData = urlParser.parse(req.url, true)
    var id = urlData.query.id
    oldId = id
    var sql = 'select s.id, s.s_name, p.i_path from student s, paths p where s.id=' + id + ' and s.id=p.id'
    connection.query(sql, (err, results) => {
        if (err) return res.send(err)
        if (results.length == 0) return res.send({
            message: "Record not Found!"
        })
        oldPath=results[0].i_path.substring(19)
        res.render('update', {
            title: 'Update',
            id: results[0].id,
            name: results[0].s_name,
            path: results[0].i_path
        })
    })
})

router.post('/update/updated', (req, res) => {
    var id = req.body.id
    var s_name = req.body.s_name
    var path;
    console.log(req.body.path)
    if (req.body.path) {
        path = req.body.path
    }else{
        path=oldPath
    }
    var sql1 = "UPDATE student set id=" + id + ", s_name=\'" + s_name + '\',' + 'image=load_file(\'/home/pika/Desktop/' + path + '\') WHERE id=' + oldId
    connection.query(sql1, (err, results) => {
        if (err) return res.send(err)
        res.send({
            message: "Record updated successfully!",
            query: sql1
        })
    })
    var sql2 = "UPDATE paths SET id=" + id + ", i_path=\'/home/pika/Desktop/" + path +"\' WHERE id=" + oldId
    connection.query(sql2, (err, results) => {
        if (err) return console.log(err)
    })
})


module.exports = router