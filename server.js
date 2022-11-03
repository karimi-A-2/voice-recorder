const express = require('express');
const app = express();
const fs = require('fs')

app.use(express.static("public"))

app.set('view engine', 'ejs')
app.use(express.json())   // when posting json information fetch from client to sever
// app.use(express.urlencoded({ extended: true }))  // this allows us to access information coming from form

app.get('/', function (req, res) {
    fs.readFile('data.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            res.body = data
            res.render('app.ejs', {
                data: JSON.parse(data)
            })
        }
    })
})

app.post('/classes/new', function (req, res) {
    console.log(req.body);
    let className = req.body.value
    fs.readFile('data.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            var data = JSON.parse(data)
            data.classes.push(className)
            fs.writeFile("./data.json", JSON.stringify(data, null, 4), err => {
                if (err) {
                    console.log("Error writing file:", err);
                    res.sendStatus(400);
                    res.end();
                } else {
                    res.sendStatus(200);
                    res.end();
                }
            });
        }
    })
})

app.listen(4000);
