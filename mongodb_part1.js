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

// ------------------------- 
//  3.3 Query
// -------------------------
db.restaurants.updateMany({borough : "Manhattan"}, { $push: { grades: { grade: "A", score: 7, date: ISODate() } } })
// Result: { "acknowledged" : true, "matchedCount" : 10259, "modifiedCount" : 10259 }

// ------------------------- 
//  3.4 Query
// -------------------------
db.restaurants.find({"grades.8.score" : {$lt: 7}}, {name:1, _id:0})
// Result: 
// { "name" : "Silver Krust West Indian Restaurant" }
// { "name" : "Pure Food" }

// ------------------------- 
//  3.5 Query
// -------------------------
db.restaurants.find({cuisine : "Seafood", grades : { $elemMatch : {grade : "B", date:{$gte: ISODate("2014-02-01T00:00:00.000Z"),$lt: ISODate("2014-03-01T00:00:00.000Z")}}}}, {_id:1, borough:1})
// Result:
// { "_id" : ObjectId("5a55e5eb2102716b78cb3897"), "borough" : "Bronx" }
// { "_id" : ObjectId("5a55e5eb2102716b78cb3b15"), "borough" : "Manhattan" }


// ------------------------- 
//  4.1 Query
// -------------------------
db.restaurants.createIndex({name : 1})
db.restaurants.find({ name: "Glorious Food" }).explain()
// "winningPlan" : {
//     "stage" : "FETCH",
//     "inputStage" : {
//             "stage" : "IXSCAN",
//             "keyPattern" : {
//                     "name" : 1
//             },
//             "indexName" : "name_1",
//             "isMultiKey" : false,
//             "multiKeyPaths" : {
//                     "name" : [ ]
//             },
//             "isUnique" : false,
//             "isSparse" : false,
//             "isPartial" : false,
//             "indexVersion" : 2,
//             "direction" : "forward",
//             "indexBounds" : {
//                     "name" : [
//                             "[\"Glorious Food\", \"Glorious Food\"]"
//                     ]
//             }
//     }
// }


// ------------------------- 
//  4.2
// -------------------------
db.restaurants.getIndexes()
// [
//         {
//                 "v" : 2,
//                 "key" : {
//                         "_id" : 1
//                 },
//                 "name" : "_id_",
//                 "ns" : "frontcamp.restaurants"
//         },
//         {
//                 "v" : 2,
//                 "key" : {
//                         "name" : 1
//                 },
//                 "name" : "name_1",
//                 "ns" : "frontcamp.restaurants"
//         }
// ]
db.restaurants.dropIndex("name_1")
//{ "nIndexesWas" : 2, "ok" : 1 }
db.restaurants.getIndexes()
// [
//         {
//                 "v" : 2,
//                 "key" : {
//                         "_id" : 1
//                 },
//                 "name" : "_id_",
//                 "ns" : "frontcamp.restaurants"
//         }
// ]
