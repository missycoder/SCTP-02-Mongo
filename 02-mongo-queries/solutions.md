# Restaurants Questions
## Q1

* First argument to `find` is the filering
* Second argument to `find` is the projection,

```
db.restaurants.find({
    'cuisine':'Hamburgers'
},{
    'name':1,
    'address':1,
    'cuisine':1
})
```
## Q2
```
db.restaurants.find({
    'cuisine':'American',
    'borough':'Bronx'
}, {
    'name': 1,
    'address': 1,
    'cuisine': 1,
    'borough': 1
})
```

## Q3

```
db.restaurants.find({
    'address.street':'Stillwell Avenue'
}, {
    'name': 1,
    'address': 1
})
```

# Questions for `sample_mflix` database

## Q1
```
db.movies.find({}).count()
```

## Q2
```
db.movies.find({
    'released':{
        '$lt':ISODate('2000-01-01')
    }
}).count()
```

## Q3

If we are searching for just one value in an array, there's no need to use `$in`:

```
db.movies.find({
    'countries':'USA'
})
```

Alternatively:

```
db.movies.find({
    'countries':{
        '$in':['USA']
    }
},{
    'title': 1,
    'countries': 1
}).limit(10)
```

## Q4
```
db.movies.find({
    'countries':{
        '$nin':['USA']
    }
},{
    'title': 1,
    'countries': 1
})
```

## Q5
```
db.movies.find({
    'awards.wins': {
        '$gte': 3
    }
},{
    'title': 1,
    'awards.wins': 1
})
```

## Q5
```
db.movies.find({
    'awards.nominations':{
        '$gte':3
    }
},{
    'title':1,
    'awards.nominations': 1
})
```

## Q6
```
db.movies.find({
    'cast':'Tom Cruise'
}, {
    'title': 1,
    'cast': 1
})
```

## Q7
```
db.movies.find({
    'directors':'Charles Chaplin'
},{
    'title': 1,
    'directors': 1
})
```