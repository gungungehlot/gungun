const mongoose = require("mongoose");

const schema =  mongoose.Schema =
    {
    adminId: {
        type: String
    },
    action: {
        type: String
    },
    details: {
        type: String
    },
    iaActive: {
        type : Boolean,
        default : true
    },
    time: {
        type: Date,
        default: Date.now   
    }
}

const activitymodel = mongoose.model('activits',schema)
module.exports = activitymodel