const express=require('express');
const bodyParser=require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors=require('cors'); 
require('dotenv').config()


const app=express();
app.use(bodyParser.json())
app.use(cors());

// https://git.heroku.com/gentle-hollows-19917.git
// https://gentle-hollows-19917.herokuapp.com/

// console.log(process.env.USER);




const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.lqicv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });


client.connect(err => {
    const collection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTION}`);
    const userWorkCollection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTIONFROMUSER}`);

    app.get('/works',(req,res)=>{

        collection.find({})
        .toArray((err,docs)=>{
            res.status(200).send(docs)
        })
    })

    app.get('/works/:id',(req,res)=>{
        const id=req.params.id;
        collection.find({id:id})
        .toArray((err,docs)=>{
            res.send(docs[0])
        })
    })

    app.post('/userWork',(req,res)=>{
        const work=req.body;

        userWorkCollection.insertOne(work)
        .then(result => {
            console.log(result);

            res.status(200).send(result)
        })
    })

});





app.get('/',(req,res)=>{
    res.status(200).send('<h1>Hello world </h1>')
})

app.get('/name',(req,res)=>{
    res.status(200).send('<h1>MD SOHIDUL ISLAM</h1>')
})

app.listen(process.env.PORT || 4003,()=>{
    console.log("Server is running on PORT 4003");
})