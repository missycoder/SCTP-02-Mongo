db.listingsAndReviews.find({
    'cancellation_policy':"flexible"
}, {
    'name':1,
    'cancellation_policy':1,
    'bedrooms':1
})