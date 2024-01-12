const mongo = require('mongoose')


const schoolSchema = mongo.Schema({
    name:String,
    code:String,
    moto:String,
    location:Object,
    headMaster:String,
    schoolEmail:String,
    schoolPrograms:Array,
    schoolPhoneNumber:String,
})

module.exports = mongo.model("School", schoolSchema)