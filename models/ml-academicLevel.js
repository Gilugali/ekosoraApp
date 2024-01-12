const mongo = require('mongoose');
const combinationSchema = mongo.Schema({
    name: String,
    subjects: [{
        type:mongo.Schema.Types.ObjectId,
        ref:'subject'
    }],
    
})


const Combination = mongo.model('combination', combinationSchema, "combination")

const academicLevelSchema = mongo.Schema({
    year: Number,
    combinations:[{ 
    type: mongo.Schema.Types.ObjectId,
    ref:'Combination'
}]
  
});

const level = mongo.model('academiclevel', academicLevelSchema);

module.exports = {
    Combination,
    level
}
    