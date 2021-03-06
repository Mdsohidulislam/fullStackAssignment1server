const express=require('express');
const bodyParser=require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const cors=require('cors'); 
require('dotenv').config()
var admin = require("firebase-admin");

const app=express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


var serviceAccount = require("./an-honest-volunteer-firebase-adminsdk-xy1uq-8031c9431d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.lqicv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });


client.connect(err => {
    const collection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTION}`);
    const userWorkCollection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTIONFROMUSER}`);
    
    app.get('/volunteers',(req,res)=>{ 
        const Bearer=req.headers.authorization;
        const queryEmail=req.query.email;

        if(Bearer && Bearer.startsWith('Honest')){
            const idToken=Bearer.split(' ')[1]; 

            admin
            .auth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
            const uid = decodedToken.email; 
                
            if(uid ==queryEmail){
                        userWorkCollection.find({email:queryEmail})
                        .toArray((err,docs)=>{
                            res.status(200).send(docs)
                        })
            }
            })
            .catch((error) => {
                res.status(401).send('unAuthorized access')
            });
        }else{
            res.status(401).send('unAuthorized access')
        }
    })
    
    app.delete('/delete/:id',(req,res)=>{

        console.log(req.params.id);

        userWorkCollection.deleteOne({_id:ObjectId(`${req.params.id}`)})
        .then(result => res.send(result))
    })

    app.post('/addEvent',(req,res)=>{ 
        userWorkCollection.insertOne(req.body)
        .then(result => res.status(200).send(result))
    })


    app.get('/allWorks',(req,res)=>{ 
        const Bearer=req.headers.authorization;
        const queryEmail=req.query.email;

        if(Bearer && Bearer.startsWith('Honest')){
            const idToken=Bearer.split(' ')[1]; 

            admin
            .auth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
            const uid = decodedToken.email; 
                
            if(uid ==queryEmail){
                        userWorkCollection.find({})
                        .toArray((err,docs)=>{
                            res.status(200).send(docs)
                        })
            }
            })
            .catch((error) => {
                res.status(401).send('unAuthorized access')
            });
        }else{
            res.status(401).send('unAuthorized access')
        }
    })
    

    app.post('/many',(req,res)=>{
        console.log(req.body);
    })


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

    app.delete('/delete/:id',(req,res)=>{
        userWorkCollection.deleteOne({_id:req.params.id})
        .then(result => res.send(result))
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




app.listen(process.env.PORT || 4003,()=>{
    console.log("Server is running on PORT 4003")
})