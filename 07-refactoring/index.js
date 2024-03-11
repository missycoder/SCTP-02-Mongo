const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// if we are trying to require from our
// own files, we need the './'
const { connect} = require('./MongoUtil');
const { authenticateWithJWT} = require('./middleware');

// create the express application
const app = express();

// enable cors
app.use(cors());

// set JSON as the means of
// receiving requests and sending responses
app.use(express.json());

// A jwt is sometimes known as an 'access token' because it grants access
// to your services or protected routes
function generateAccessToken(id, email) {
    // the first arugment of `jwt.sign` is the payload that you want to store
    // the second argument of `jwt.sign` is the token secret
    // the third arugment is an option object
    return jwt.sign({
        'user_id': id,
        'email': email
    }, process.env.TOKEN_SECRET, {
        'expiresIn':'3d'  // w = weeks, d = days, h = hours, m = minutes, s = seconds
    });
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

    // Users sign up and log in
    // It is very common in RESTFul API to represent a process as a document 
    // that is created because of said process
    app.post('/user', async function(req,res){

        // hashing with bcrypt is an async function
        // bcyrpt.hash takes two argument:
        // 1. the plaintext that you want to hash
        // 2. how secure you want it
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const result = await db.collection('users').insertOne({
            'email': req.body.email,
            'password': hashedPassword
        })
        res.json({
            'result': result
        })
    })

    // Allow user to log in by providing their email and password
    app.post('/login', async function(req,res){
        // 1. Find the user by email address
        const user = await db.collection('users')
                        .findOne({
                            email: req.body.email
                        });

        
        // 2. Check if the password matches
        if (user) {
            // bcrypt.compare()
            // - first arugment is the plaintext
            // - second argument is the hashed version 
            if (await bcrypt.compare(req.body.password, user.password)) {
                // valid login - so generate the JWT
                const token = generateAccessToken(user._id, user.email);
                res.json({
                    'token': token
                })
            } else {
                res.status(400);
                res.json({
                    'error':'Invalid login credentials'
                })
            }
        } else {
            res.status(400);
            return res.json({
                'error':'Invalid login credentials'
            })
        }

        // 3. Generate and send back the JWT (aka access token)
    });

    // Protected route: client must provide the JWT to access
    app.get('/profile', authenticateWithJWT, async function(req,res){
       
        res.json({
            'message':'success in accessing protected route',
            'payload': req.payload
        })
    })

    app.get('/payment', authenticateWithJWT, async function(req,res){
        res.json({
            'message':"accessing protected payment route"
        })
    })
        
    
}

main();

app.listen(3000, function () {
    console.log("Server has started");
});