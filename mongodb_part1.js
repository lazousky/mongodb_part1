// ------------------------- 
//  3.1 Query
// -------------------------
db.restaurants.find({$and: [{cuisine:"Chinese"},{borough:"Queens"}]}).count()
// Result: 728


// ------------------------- 
//  3.2 Query
// -------------------------
db.restaurants.find().sort({"grades.score":-1}).limit(1) // OR explicitly: db.restaurants.find({},{_id:1}).sort({"grades.score":-1}).limit(1)
// Result: "_id" : ObjectId("5a55e5eb2102716b78cb048a")