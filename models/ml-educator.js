const mongo = require("mongoose")

const educatorSchema = mongo.Schema({
    names: String,
    // code: String,
    title: String,
    year:Array,
    lessons: Array,
    schoolProgram:Array,
    email: String,
    tel: String,
    password: String,
    profileLink: {
        type: String,
        default: "https://res.cloudinary.com/dyrneab5i/image/upload/v1651564772/h2tjxuh4t7c739ks6ife.png"
    },
    googleUser: Object,
    allTokens: Object
})

module.exports = mongo.model('educators', educatorSchema, "educators")