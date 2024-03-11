const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

async function connect(uri, dbname) {

    // `connect` allows us to connect to the mongodb
    // useUnifiedTopology means we want use the latest
    // structure for Mongo
    const client = await MongoClient.connect(uri);
    let db = client.db(dbname);
    return db;
}

// export out the connect functino
// the reason is so that other .js files can use the function
module.exports = {connect};

