const express = require('express');
const app = express();

app.use(express.static("public")) 

app.use(express.urlencoded({extended: true}))  // this allows us to access information coming from form
app.use(express.json())   // when posting json information fetch from client to sever

app.set('view engine', 'ejs')

app.listen(4000);
