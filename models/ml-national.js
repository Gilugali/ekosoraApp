const mongo = require('mongoose')


const nationalSchema = mongo.Schema({

    students:[{
        type:mongo.Schema.Types.ObjectId,
        ref:'students'
    }],
    educators:[{
        type:mongo.Schema.Types.ObjectId,
        ref:'educators'
    }],
    parents:[{
      type:mongo.Schema.Types.ObjectId,
      ref:'parent'
    }],
    combination:[{
        type:mongo.Schema.Types.ObjectId,
        ref:'combination'
    }],
    level:[{
        type:mongo.Schema.Types.ObjectId,
        ref:'level'
    }],
    subjects:[{
        type:mongo.Schema.Types.ObjectId,
        ref:'subject'
    }],
})

module.exports = mongo.model("National", nationalSchema, "National")