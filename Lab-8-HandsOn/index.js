const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
require('dotenv').config();

const MongoClient = mongodb.MongoClient;

let app = express();


app.use(cors());

app.use(express.json());

async function connect(uri, dbname) {

   
    let client = await MongoClient.connect(uri,{
        useUnifiedTopology: true
    });
    let db = client.db(dbname);
    return db;
}

async function main() {
   
    const mongoUri =  process.env.MONGO_URI;
   
    let db = await connect(uri, "sctp02_food_sightings");

  
    app.get("/", async function(req,res){
try {
        const results = await db.collection("sightings").find({}).limit(10).toArray();

        res.json({
            'sightings': results
        })
    } catch (e) {
        res.status(500);
        res.json({
            'error' : e
        })
    }
    })
}

app.post("/food-sighting", async function(req,res) {

let description = req.body.description;
let food = req.body.food;
let dateTime = new Date(req.body.dateTime) || new Date();

try {
    let result = await db.collection ("sightings").insertOne({
        'description': description,
    'food': food,
    'dateTime': dateTime
    });
    res.status(200);
    res.send(result);
} catch(e) {
    res.status(500);
    res.send({
        'error': "Internal server error. Please contact administrator"
    });
    console.log(e);
}
)};


main ();

app.listen(3000, function(){
    console.log("Server has started");
})