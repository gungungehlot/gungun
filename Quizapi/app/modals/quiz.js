const mongoose = require('mongoose')

const schema =  mongoose.Schema=
    {
    name: {
        type : String,
        required :[true ,'quiz name is required']
        },
        Quizobj: {
            type: Object,
            required: [true , 'Quiz object id is required']
        },
    topicid : {
        type : String,
        required: [true , 'topic id is compulsory'],
        ref : 'topics'
       },
        slug:{
        type: String,
        required : [true,'slug is reuired'],
    },
    image :{
        type : String,
        default : ' '
        },
    status:{
            type : Boolean,
            default : true
        },
    Create_at:{
            type:Date,
            default:Date.now()
        },
    Update_at:{
            type:Date,
            default:Date.now()
        },
    Delete_at:{
            type:Date,
            default:null
        }
    }

const quizmodel = mongoose.model('quizs',schema)
module.exports = quizmodel;