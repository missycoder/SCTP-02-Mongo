# See all databases
```
show databases
```

# Change the active database
```
use sample_airbnb
```

# Show all the collections in the current active database
```
show collections
```

# Show the current active database
```
db
```

# Get all documents from a collection
```
db.listingsAndReviews.find()
```

# Projection: extract only a few keys out from each document.

The second argument of `.find()` is the `projection object`. It allows us to list which keys we want.

```
db.listingsAndReviews.find({}, {
    'name': 1,
    'beds': 1
})
```

## To show the number of beds, bedrooms and the name of each listing
```
db.listingsAndReviews.find({}, {
    'name': 1,
    'beds': 1,
    'bedrooms':1
})
```

# FILTERING
Allows us to only get documents that fits a certain critera. We only have listings that
have exactly two beds.

The first argument to `.find()` is the filtering citeria. The second argument is the projection.
```
db.listingsAndReviews.find({
    "beds":2
},{
    'name':1,
    'beds':1
})
```

Find all listings which the property type is Condominium and only display its name, number of beds and its property type.

```
db.listingsAndReviews.find({
    'property_type':"Condominium"
}, {
    'name':1,
    'beds':1,
    'property_type':1
})
```

Find all the listings which cancellation policy is 'flexible' (`cancellation_policy`). Show only their name, their cancellation policy and the number of bedrooms.

```
db.listingsAndReviews.find({
    'cancellation_policy':'flexible'
},{
    'name':1,
    'cancellation_policy':1,
    'bedrooms':1
})
```

# Filtering by two criteria

Find all listings which has 4 beds and 2 bedrooms.

```
db.listingsAndReviews.find({
    'beds': 4,
    'bedrooms': 2
}, {
    'name': 1,
    'beds': 1,
    'bedrooms': 1
})
```

Find all listings which cancellation policy is 'flexible' and they can accommodate 4 people.

```
db.listingsAndReviews.find({
    'cancellation_policy':'flexible',
    'accommodates': 4
}, {
    'name': 1,
    'cancellation_policy': 1,
    'accommodates': 1
})
```

# Find by a key inside an object
Show all listings which country is Brazil

```
db.listingsAndReviews.find({
    'address.country':"Brazil"
}, {
    'name': 1,
    'address.country': 1
})
```

Find all listings by the host whose name is "Jonathan"

```
db.listingsAndReviews.find({
    'host.host_name':'Jonathan'
},{
    'name': 1,
    'host.host_name':1
})
```

# Find by a value inside an array

Show all listings which amenities include 'Oven'
```
db.listingsAndReviews.find({
    'amenities':'Oven'
},{
    'name': 1,
    'amenities':1
})
```

Show all listings which amenities include both 'Oven' and 'Coffee Maker'

```
db.listingsAndReviews.find({
    'amenities': {
        '$in':['Oven', 'Coffee Maker']
    }
}, {
    'name': 1,
    'amenities': 1
});
```

# Searching by either-or'

Find all listings that are in Brazil or Canada
```
db.listingsAndReviews.find({
    '$or': [
        {
            'address.country':'Brazil'
        },
        {
            'address.country':'Canada'
        }
    ],
}, {
    'name': 1,
    'address.country': 1
})
```

Find all listings that are in Brazil and have 2 bedrooms, OR listings that are in Canada and the cancellation policy is 'flexible'.

```
db.listingsAndReviews.find({
    '$or':[
        {
            'address.country':'Brazil',
            'bedrooms': 2
        },
        {
            'address.country':'Canada',
            'cancellation_policy':'flexible'
        }
    ]
}, {
    'name': 1,
    'bedrooms': 1,
    'address.country': 1
})
```

# Searching by range of values

Find all listings that has between 2 to 4 beds.

```
db.listingsAndReviews.find({
    'beds': {
        '$gt': 1,
        '$lt': 5
    }
}, {
    'name': 1,
    'beds': 1
})
```

Find all listings that accomndates between 3 to 6 people.

```
db.listingsAndReviews.find({
    'accommodates': {
        '$gte': 3,
        '$lte': 6
    }
}, {
    'name': 1,
    'accommodates': 1
})
```

## Finding by dates
Find all listings which first reviewed is before the year 2020.

To create a date as a filtering criteria, use `ISODate('YYYY-MM-DD')`

```
db.listingsAndReviews.find({
    'first_review': {
        '$lt': ISODate("2020-01-01")
    }
}, {
    'name': 1,
    'first_review': 1
})
```

# Counting
Count how many reviews are made before 2020
```
db.listingsAndReviews.find({
    'first_review': {
        '$lt': ISODate("2020-01-01")
    }
}, {
    'name': 1,
    'first_review': 1
}).count()
```

## Find by a string
Find all listings which name contains the string "Spacious"

* `'$regex':'spacious'`: search for the string 'spacious' within the `name` key. Regular Expressions (`regex` for short) can help us match patterns in a string.
* `'$options':'i'` : ignore case

```
db.listingsAndReviews.find({
    'name': {
        '$regex':'spacious', '$options': 'i'
    }
}, {
    'name': 1
})
```

# Find a document by its ID

```
use sample_restaurants
db.restaurants.find({
    '_id': ObjectId('5eb3d668b31de5d588f42948')
})
```

# How to count
```
db.restaurants.find({}).count()
```