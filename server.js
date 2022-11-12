const express = require('express');
const app = express();
const fs = require('fs')
const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

app.use(express.static("public"))
app.use(express.static('uploads'));
app.set('view engine', 'ejs')
app.use(express.json())   // when posting json information fetch from client to sever
app.use(express.urlencoded({ extended: true }))  // this allows us to access information coming from form

const port = process.env.PORT || 4000;

app.get('/', function (req, res) {
    fs.readFile('data.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            res.render('app.ejs', {
                data: JSON.parse(data)
            })
        }
    })
})

app.get('/data', function (req, res) {
    fs.readFile('data.json', function (error, data) {
        if (error) {
            res.status(500).end();
        } else {
            res.send(data);
        }
    })
})

app.post('/data', function (req, res) {
    fs.writeFile("./data.json", JSON.stringify(req.body, null, 4), err => {
        if (err) {
            console.log("Error writing file:", err);
            res.sendStatus(400);  // todo: find correct status code
        } else {
            res.sendStatus(200);
        }
        res.end();
    });
})

app.post('/classes/new', function (req, res) {
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
                    res.sendStatus(400);  // todo: find correct status code
                } else {
                    res.sendStatus(200);
                }
                res.end();
            });
        }
    })
})

app.post('/tracks/new', function (req, res) {
    fs.readFile('data.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            var data = JSON.parse(data);
            data.tracks.push(req.body);  // here req.body is object
            fs.writeFile("./data.json", JSON.stringify(data, null, 4), err => {
                if (err) {
                    console.log("Error writing file:", err);
                    res.sendStatus(400);  // todo: find correct status code
                } else {
                    res.sendStatus(200);
                }
                res.end();
            });
        }
    })
})

app.post('/record', upload.single('audio'), (req, res) => {
    res.json({ success: true })
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
