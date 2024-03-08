const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');

// A Mongo client allows Express (or any
// NodeJS application) to send request
// to a Mongo database
const MongoClient = mongodb.MongoClient;

// create the express application
const app = express();

// enable cors
app.use(cors());

// set JSON as the means of
// receiving requests and sending responses
app.use(express.json());

// function to connect to the database
async function connect(uri, dbname) {

    // `connect` allows us to connect to the mongodb
    // useUnifiedTopology means we want use the latest
    // structure for Mongo
    const client = await MongoClient.connect(uri,{
        useUnifiedTopology: true
    });
    let db = client.db(dbname);
    return db;
}

async function main() {
    // connection string goes here
    const uri =  "mongodb+srv://root:rotiprata123@cluster0.cacnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    // get the database using the `connect` function
    const db = await connect(uri, "sample_mflix");

    // create the routes after connecting to the database
    app.get("/", async function(req,res){

        // get the first ten moves
        const results = await db.collection("movies").find({}).limit(10).toArray();

        res.json({
            'movies': results
        })
    })
}

main();

app.listen(3000, function(){
    console.log("Server has started");
});