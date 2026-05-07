const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        name : 
        {
            type : String,
            required : [true , 'Name is required']
        },
        image:{
            type : String,
            default : ''
        },
        designation:{
            type : String,
            required : [true , 'Designation is required']
        },
        discription:{
            type : String,
            required : [true , 'discription is required']
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
const testimonialmodal = mongoose.model('testimonials',schema)
module.exports = testimonialmodal;