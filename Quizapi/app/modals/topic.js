const mongoose = require('mongoose')
const schema = new mongoose.Schema(
    {
        name:
        {
            type : String,
            required :[true , 'Name is required']
        },
        order:
        {
            type:Number,
            default : 0
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
)
const topicmodel = mongoose.model('topics',schema)
module.exports = topicmodel