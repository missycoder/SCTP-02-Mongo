# Create a new mongo database
We just `use` the database assuming that it exists. 

Assuming that we want to create a new `animal_shelter`

Just type:
```
use animal_shelter
```

The database is created (i.e saved to the hard disk permanently) only when you add a new collection with at least one document to it

# Create a new document in a new collection?

Add a new document to a new collection named `animals`:

```
db.animals.insertOne({
    'name':'Fluffy',
    'age': 3,
    'breed':'Golden Retriever',
    'type':'Dog'
})
```

# Insert many documents at the same time?
```
db.animals.insertMany([
    {
        'name':'Dazzy',
        'age': 5,
        'breed':'Greyhound',
        'type':'Dog'
    },
    {
        'name':'Timmy',
        'age': 1,
        'breed':'Border Collie',
        'type':'Dog'
    }
])
```

Insert the following
```
{
    "name":"Garfield",
    "age": 3,
    "breed":"Orange Cat",
    "type":"Cat"
}
```

The command is:
```
db.animals.insertOne({
    'name':'Garfield',
    'age': 3,
    'breed':'Orange Cat',
    'type':'Cat'
})
```

# Updating

The general syntax for `updateOne` is:

```
db.collection_name.updateOne({
    <criteria of the document to update>
},{
    <the new changes>
})
```

Disclaimer: Every document will have its own unique ID. If you are following this example at home, check your own collection for the document's `_id` to use
```
db.animals.updateOne({
    '_id': ObjectId('65ea80c7a0700b9fc5d061c9')
},{
    '$set': {
        'name':'Thunder'
    }
})
```

# Update all the fields
We have to manually put in all the fields for the object referred by `$set`

```
db.animals.updateOne({
    "_id":ObjectId("65ea8169a0700b9fc5d061ca")
},{
    '$set':{
        'name':"Daisy",
        'age': 3,
        'breed':'Brown Dwarf',
        'type':'Rabbit'
    }
})
```

# Delete

```
db.animals.deleteOne({
    "_id": ObjectId('65ea8169a0700b9fc5d061cb')
})
```

# CRUD with arrays

We want to add in a `checkups` to each animal. If an animal has two checkups, there should be two items in the array.

## Add to array

* Note: the array does not have to exist
* For embedded documents, we have to manually provide an ID
```
db.animals.updateOne({
    '_id': ObjectId('65ea80c7a0700b9fc5d061c9')
}, {
    '$push': {
        'checkups': {
            "_id": ObjectId(),
            "name": "Dr. Chua",
            "diagnosis": "flu",
            "treatment": "pills"
        }
    }
})
```

## Remove from array

* We use `$pull`

```
db.animals.updateOne({
    "_id":ObjectId("65ea80c7a0700b9fc5d061c9")
}, {
    "$pull": {
        "checkups": {
            "_id": ObjectId("65ea8a04a0700b9fc5d061d0")
        }
    }
})
```

## Modify an item in an array

```
db.animals.updateOne({
    '_id': ObjectId('65ea80c7a0700b9fc5d061c9'),
    'checkups': {
        '$elemMatch': {
            '_id': ObjectId('65ea8b10a0700b9fc5d061d1')
        }
    }
}, {
    "$set": {
        "checkups.$.name":"Dr. Su"
    }
})
```