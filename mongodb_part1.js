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


// ------------------------- 
//  4.3
// -------------------------
db.restaurants.createIndex({"restaurant_id" : 1, "borough" : 1})

db.restaurants.find({ restaurant_id: "41098650" }, { _id: 0, borough: 1 }).explain("executionStats")
// "winningPlan" : {
//     "stage" : "PROJECTION",
//     "transformBy" : {
//             "_id" : 0,
//             "borough" : 1
//     },
//     "inputStage" : {
//             "stage" : "IXSCAN",
//             "keyPattern" : {
//                     "restaurant_id" : 1,
//                     "borough" : 1
//             },
//             "indexName" : "restaurant_id_1_borough_1",
//             "isMultiKey" : false,
//             "multiKeyPaths" : {
//                     "restaurant_id" : [ ],
//                     "borough" : [ ]
//             },
//             "isUnique" : false,
//             "isSparse" : false,
//             "isPartial" : false,
//             "indexVersion" : 2,
//             "direction" : "forward",
//             "indexBounds" : {
//                     "restaurant_id" : [
//                             "[\"41098650\", \"41098650\"]"
//                     ],
//                     "borough" : [
//                             "[MinKey, MaxKey]"
//                     ]
//             }
//     }
// }
//
//
// "executionStats" : {
//     "executionSuccess" : true,
//     "nReturned" : 1,
//     "executionTimeMillis" : 1,
//     "totalKeysExamined" : 1,
//     "totalDocsExamined" : 0,
//     "executionStages" : {
//             "stage" : "PROJECTION",
//             "nReturned" : 1,
//             "executionTimeMillisEstimate" : 0,
//             "works" : 2,
//             "advanced" : 1,
//             "needTime" : 0,
//             "needYield" : 0,


// ------------------------- 
//  4.4
// -------------------------
db.restaurants.createIndex({"cuisine" : 1}, {"partialFilterExpression" : {"borough":{ $eq: "Staten Island" } }})
//
//
db.restaurants.find({ borough: "Staten Island", cuisine: "American" }).explain("executionStats")
// "winningPlan" : {
//     "stage" : "FETCH",
//     "filter" : {
//             "borough" : {
//                     "$eq" : "Staten Island"
//             }
//     },
//     "inputStage" : {
//             "stage" : "IXSCAN",
//             "keyPattern" : {
//                     "cuisine" : 1
//             },
//             "indexName" : "cuisine_1",
//             "isMultiKey" : false,
//             "multiKeyPaths" : {
//                     "cuisine" : [ ]
//             },
//             "isUnique" : false,
//             "isSparse" : false,
//             "isPartial" : true,
//             "indexVersion" : 2,
//             "direction" : "forward",
//             "indexBounds" : {
//                     "cuisine" : [
//                             "[\"American\", \"American\"]"
//                     ]
//             }
//     }
// }
//
// "executionStats" : {
//     "executionSuccess" : true,
//     "nReturned" : 244,
//     "executionTimeMillis" : 1,
//     "totalKeysExamined" : 244,
//     "totalDocsExamined" : 244,
//     "executionStages" : {
//             "stage" : "FETCH",
//             "filter" : {
//                     "borough" : {
//                             "$eq" : "Staten Island"
//                     }
//             },
//             "nReturned" : 244,
//             "executionTimeMillisEstimate" : 0,
//             "works" : 245,
//             "advanced" : 244,
//             "needTime" : 0,
//             "needYield" : 0,
//             "saveState" : 1,
//             "restoreState" : 1,
//             "isEOF" : 1,
//             "invalidates" : 0,
//             "docsExamined" : 244,
//             "alreadyHasObj" : 0,
//             "inputStage" : {
//                     "stage" : "IXSCAN",
//                     "nReturned" : 244,
//                     "executionTimeMillisEstimate" : 0,
//                     "works" : 245,
//                     "advanced" : 244,
//                     "needTime" : 0,
//                     "needYield" : 0
//
db.restaurants.find({ borough: "Staten Island", name: "Bagel Land" }).explain("executionStats")
// "winningPlan" : {
//     "stage" : "COLLSCAN",
//     "filter" : {
//             "$and" : [
//                     {
//                             "borough" : {
//                                     "$eq" : "Staten Island"
//                             }
//                     },
//                     {
//                             "name" : {
//                                     "$eq" : "Bagel Land"
//                             }
//                     }
//             ]
//     },
//     "direction" : "forward"
// }
//
// "executionStats" : {
//     "executionSuccess" : true,
//     "nReturned" : 1,
//     "executionTimeMillis" : 22,
//     "totalKeysExamined" : 0,
//     "totalDocsExamined" : 25359,
//     "executionStages" : {
//             "stage" : "COLLSCAN",
//             "filter" : {
//                     "$and" : [
//                             {
//                                     "borough" : {
//                                             "$eq" : "Staten Island"
//                                     }
//                             },
//                             {
//                                     "name" : {
//                                             "$eq" : "Bagel Land"
//                                     }
//                             }
//                     ]
//             },
//             "nReturned" : 1,
//             "executionTimeMillisEstimate" : 22,
//             "works" : 25361,
//             "advanced" : 1,
//             "needTime" : 25359,
//             "needYield" : 0,

db.restaurants.find({ borough: "Queens", cuisine: "Pizza" }).explain("executionStats")
// "winningPlan" : {
//     "stage" : "COLLSCAN",
//     "filter" : {
//             "$and" : [
//                     {
//                             "borough" : {
//                                     "$eq" : "Queens"
//                             }
//                     },
//                     {
//                             "cuisine" : {
//                                     "$eq" : "Pizza"
//                             }
//                     }
//             ]
//     },
//     "direction" : "forward"
// },
//
//
// "executionStats" : {
//     "executionSuccess" : true,
//     "nReturned" : 277,
//     "executionTimeMillis" : 18,
//     "totalKeysExamined" : 0,
//     "totalDocsExamined" : 25359,
//     "executionStages" : {
//             "stage" : "COLLSCAN",
//             "filter" : {
//                     "$and" : [
//                             {
//                                     "borough" : {
//                                             "$eq" : "Queens"
//                                     }
//                             },
//                             {
//                                     "cuisine" : {
//                                             "$eq" : "Pizza"
//                                     }
//                             }
//                     ]
//             },
//             "nReturned" : 277,
//             "executionTimeMillisEstimate" : 30,
//             "works" : 25361,
//             "advanced" : 277,
//             "needTime" : 25083,
//             "needYield" : 0,

