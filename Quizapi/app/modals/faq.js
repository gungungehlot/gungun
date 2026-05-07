const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        question:{
            type:String,
            required : [true,'Question is required']
        },
        answer:{
            type:String,
            required : [true,'answer is required']
        },
         status:{
        type : Boolean,
        default : true
         },
          image:{
         type: String,
         default : ''
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
const faqmodel = mongoose.model('faqs',schema)
module.exports = faqmodel;