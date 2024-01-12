const mongo = require('mongoose')


const btecSchema = mongo.Schema({
   
    students:[{
        type:mongo.Schema.Types.ObjectId,
        ref:'Students'
    }],
    teachers:[{
        type:mongo.Schema.Types.ObjectId,
        ref:'Teachers'
    }],
  
})

module.exports = mongo.model("BTEC", btecSchema)