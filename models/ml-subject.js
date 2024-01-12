const mongo = require('mongoose')

const subjectSchema = mongo.Schema({
    name: String,
    title: String,
    marks:[
        {
            type:Object,
        }
    ]
})

module.exports = mongo.model('subject', subjectSchema)