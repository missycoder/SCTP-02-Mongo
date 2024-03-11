// 1. REQUIRE DEPENDENCIES
const express = require('express');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const cors = require('cors');
require('dotenv').config(); // we now access the key/value pairs in .env file using `process.env`

const app = express();

// enable the use of JSON
app.use(express.json());

// enable CORS 
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

console.log(MONGO_URI);
console.log(DB_NAME)

// the reason why `main()` is async is
// because I want to use `await` in it.
async function main() {

    // useUnifiedToplogy: don't use it anymore
    const client = await mongodb.MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    console.log("Connection to Mongo is successful");

    // 2. SETUP ROUTES
    app.get('/api', function (req, res) {
        res.json({
            "message": "API is running"
        })
    })

    // usually, RESTFul API's URLs will begin with `/api/` to differnate them from
    // routes that renders `hbs`.
    // a RESTFUl API deals with some kind of resources, or data records. No verbs allowed.
    app.get('/api/expenses', async function(req, res){
        const expenses = await db.collection('expenses').find({}).toArray();
        res.json({
            'expenses': expenses
        })
    })

    app.post('/api/expenses', async function(req,res){
        // Short form for below:
        // const title = req.body.title;
        // const cost = req.body.cost;
        // const tags = req.body.tags;
        // const date = req.body.date;
        const { title, cost, tags, date} = req.body;  // <- object destruturing
        
        // if the name of the key is the same as the variable name, we can use the shortcut below
        // const newExpense = {
        //     "title": title,
        //     "cost": cost,
        //     "tags": tags,
        //     "date": date
        // }

        const newExpense = { title, 
                            cost, 
                            tags, 
                            date: new Date(date)  // make sure we are storing a date object in the document
                        };
       
        const result = await db.collection("expenses").insertOne(newExpense);
     
        // res.json({
        //     "result": result
        // })
        res.json({
            result
        })
    });

    app.delete('/api/expenses/:expenseid', async function(req,res){
       const expenseId = req.params.expenseid;
       const result = await db.collection('expenses').deleteOne({
        '_id': new ObjectId(expenseId)
       })
       res.json({
            "result": result
       })
    })

    app.put("/api/expenses/:expenseid", async function(req,res){
        const expenseId = req.params.expenseid;
        const { title, cost, tags, date} = req.body;
        const modifiedExpense = {
            title, cost, tags, date: new Date(date)
        }
        const result = await db.collection('expenses').updateOne({
            "_id": new ObjectId(expenseId)
        },{
            "$set": modifiedExpense
        });
        res.json({
            result: result
        })
    })
}

// call the main() function
main();


// 3. ENABLE THE SERVER
app.listen(3000, function () {
    console.log("Server has started");
})