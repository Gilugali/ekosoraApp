const mongo = require('mongoose')

const olevelSchema = mongo.Schema({
      students:[
        {
            type:mongo.Schema.Types.ObjectId,
            ref:'students'
        }
      ],
      subjects:Array
   
})

module.exports = mongo.model("Ordinary Level ", olevelSchema)
