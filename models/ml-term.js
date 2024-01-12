const mongo = require('mongoose')

const termSchema = mongo.Schema({
     key:Number,
     start:Date,
     end:Date,
     status:Boolean,
     announcements:[{
          type:mongo.Schema.ObjectId,
          ref:"announcemnt"
     }],
     national:{
       type:mongo.Schema.Types.ObjectId,
       ref:'National'
     },
    btec:{
         type:mongo.Schema.Types.ObjectId,
         ref:'btec'
    },
    cambridge:{
       type:mongo.Schema.Types.ObjectId,
       ref:'cambridge',
    }
   
})

module.exports = mongo.model('Terms', termSchema)