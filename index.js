const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');



const app=express();
app.use(bodyParser.json())
app.use(cors());


const person={
    name:'MD SOHIDUL ISLAM',
    email:'mddsohidulislam@gmail.com',
    student:'Jambaria degree college',
    skills:'html css js react.js node.js mongodb bootstrap a'
}

app.get('/',(req,res)=>{
    res.status(200).send(person)
})


app.listen(process.env.PORT || 4002)