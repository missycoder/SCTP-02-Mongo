db.animals.updateOne({
    '_id': ObjectId('65ea80c7a0700b9fc5d061c9'),
    'checkups': {
        '$elemMatch": {
            '_id': ObjectId('65ea8b10a0700b9fc5d061d1')
        }
    }
}, {
    "$set": {
        "checkups.$.name":"Dr. Su"
    }
})