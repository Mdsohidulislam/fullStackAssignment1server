const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors'); 
require('dotenv').config()

const app=express();
app.use(bodyParser.json())
app.use(cors());

// https://git.heroku.com/gentle-hollows-19917.git
// https://gentle-hollows-19917.herokuapp.com/

// console.log(process.env.USER);




app.get('/',(req,res)=>{
    res.status(200).send('<h1>Hello world </h1>')
})

app.get('/name',(req,res)=>{
    res.status(200).send('<h1>MD SOHIDUL ISLAM</h1>')
})

app.listen(process.env.PORT || 4002)