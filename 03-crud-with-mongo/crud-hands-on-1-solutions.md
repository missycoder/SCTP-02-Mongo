# Use the new database as if it exists
```
use sctp02_fake_school
```

# Insert into the new collection to create it

```
db.students.insertMany([
    {
        "name":"Jane Doe",
        "age": 13,
        "subjects":[
            "Defense Against the Dark Arts",
            "Charms",
            "History of Magic"
        ],
        "date_enrolled": ISODate("2016-05-13")
    },
    {
        "name":"James Verse",
        "age": 14,
        "subjects": [
            "Transfiguration",
            "Alchemy"
        ],
        "date_enrolled": ISODate("2015-06-15")
    },
    {
        "name":"Jonathan Goh",
        "age": 12,
        "subjects":[
            "Divination",
            "Study of Ancient Runes"
        ],
        "date_enrolled": ISODate("2017-04-16")
    }
])
```