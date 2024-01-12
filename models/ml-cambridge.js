const mongo = require('mongoose')


const cambridgeSchema = mongo.Schema({
    term:{
        type:mongo.Schema.Types.ObjectId,
        ref:'Terms'
    },
    students:{
        type:mongo.Schema.Types.ObjectId,
        ref:'Students'
    },
    teachers:{
        type:mongo.Schema.Types.ObjectId,
        ref:'Teachers'
    },
    marks:{
        type:mongo.Schema.Types.ObjectId,
        ref:'Marks'
    }
})

module.exports = mongo.models("CAMBRIDGE", cambridgeSchema)