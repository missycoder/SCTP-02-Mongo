const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
require('dotenv').config();

// A Mongo client allows Express (or any
// NodeJS application) to send request
// to a Mongo database
const MongoClient = mongodb.MongoClient;

// create a shortcut to mongodb.ObjectId
const ObjectId = mongodb.ObjectId;

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
    const client = await MongoClient.connect(uri, {
        useUnifiedTopology: true
    });
    let db = client.db(dbname);
    return db;
}

async function main() {
    // connection string is now from the .env file
    const uri = process.env.MONGO_URI;
    // get the database using the `connect` function
    const db = await connect(uri, "sctp02_food_sightings");

    // create the routes after connecting to the database
    app.get("/food-sightings", async function (req, res) {
        try {
            // empty criteria object
            // Note: if we do a .find({}) it will return all the documents in the collection
            const criteria = {};

            if (req.query.description) {
                criteria.description = {
                    '$regex': req.query.description,
                    '$options': 'i'
                }
            }

            if (req.query.food) {
                criteria.food = {
                    '$in':[req.query.food]
                }
            }

            // get all the sightings
            const results = await db.collection("sightings").find(criteria).toArray();

            res.json({
                'sightings': results
            })
        } catch (e) {
            res.status(500);
            res.json({
                'error': e
            })
        }

    });

    // Sample Food Sighting document"
    // {
    //   _id: ObjectId(),
    //  description:"Chinese Buffet at LT2",
    //  food:["fried rice", "chicken wings"],
    //  datetime:2024-08-03
    // }
    app.post("/food-sighting", async function (req, res) {
        // try...catch is for exception handling
        // an execption is an unexpected error usually from a third party
        // (in this case, the third party is Mongo Atlas)
        try {
            const description = req.body.description;
            const food = req.body.food;
            const datetime = req.body.datetime ? new Date(req.body.datetime): new Date();
            
            if (!description) {
                res.status(400);
                res.json({
                    'error':'A description must be provided'
                });
                return;
            }

            if (!food || !Array.isArray(food)) {
                res.status(400);
                res.json({
                    'error':'Food must be provided and must be an array'
                })
            }
            
            // insert a new document based on what the client has sent
            const result = await db.collection("sightings").insertOne({
                'description': description,
                'food': food,
                'datetime': datetime
            });
            res.json({
                'result': result
            })
        } catch (e) {
            // e will contain the error message
            res.status(500); // internal server error
            res.json({
                'error': e
            })
        }

    })

    app.put('/food-sighting/:id', async function(req,res){
        try {
            const description = req.body.description;
            const food = req.body.food;
            const datetime = req.body.datetime ?  new Date(req.body.datetime) : new Date();
    
            if (!description || !food || !Array.isArray(food)) {
                res.status(400); // bad request -- the client didn't follow the specifications for our endpoint
                res.json({
                    'error': 'Invalid data provided'
                });
                return;
            }
    
            const result = await db.collection("sightings").updateOne({
                '_id': new ObjectId(req.params.id)
            },{
                '$set': {
                    'description': description,
                    'food': food,
                    'datetime': datetime
                }
            })
    
            res.json({
                'result': result
            })
        } catch (e) {
            res.status(500);
            res.json({
                'error':'Internal Server Error'
            })
        }
       
    })

    app.delete('/food-sighting/:id', async function(req,res){
        await db.collection('sightings').deleteOne({
            '_id': new ObjectId(req.params.id)
        });

        res.json({
            'message':"Deleted"
        })
    })
}

main();

app.listen(3000, function () {
    console.log("Server has started");
});