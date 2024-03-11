# Mongo API Revision

## Dependencies
* `express`
* `cors` : cross origin resources sharing. Enable if you want your API to be open to public. Don't enable if you only want your domain (i.e straitstime.come, mothership.sg) to be able to use it
* `mongodb`: enables us to connect to Mongo from our Express.
* `dotenv`: allows us to read from `.env` file 

So setup the application with

1. `npm init -y`
2. `npm install express cors mongodb dotenv`

## Connect to Mongo
Keep in mind:
1. Connecting to Mongo is an async operation. So we need to use `await`

2. We only want to create the routes after the database is connected