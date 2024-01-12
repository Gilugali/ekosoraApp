const mongo = require('mongoose')

const studentSchema = mongo.Schema({
    names: String,
    code: String,
    level: Object,
    address:Object,
    records: {
        type: Array,
        default: []
    },
    password: String,
    email: String,
    schoolProgram:String,
    parentName:String,
    parentNumber:Array,
    parentEmails: {
        type: String,
    },
    profileLink: {
        type: String,
        default: "https://res.cloudinary.com/dyrneab5i/image/upload/v1651564772/h2tjxuh4t7c739ks6ife.png"
    }
})

module.exports = mongo.model('students', studentSchema)