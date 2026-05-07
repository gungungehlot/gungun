const moongose = require('mongoose')
const schema =  moongose.Schema =
    {
        name :{
        type :String,
        required : [true, 'Name isrequired']
        },
        email : {
        type : String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        required : [true, 'Email isrequired'],
        validate: {
       validator: async function(v) {
       const email = await this.constructor.findOne({ email: v ,Delete_at : null ,  role_type : 'user'});
      return !email;
  },
  message: props => `The specified email is already in use.`
}

        },
        password : {
            type : String,
            required : [true, 'Password is required']
        },
        mobile_number : {
        type : String,
        default : ''
        },
        address : {
        type : String,
        default : ''
        },
        gender : {
        type : String,
        default : ''
        },
        role_type:{
            type : String,
            default : 'admin',
        },
        image : {
            type : String,
            default : ''
        },
        status : {
        type : Boolean,
        default : true
        },
        Create_at : {
        type : Date,
        default: Date.now()
        },
        Update_at : {
        type : Date,
        default: Date.now()
        },
        Delete_at : {
        type : Date,
        default: null
        }
    }
const usermodel = moongose.model('users',schema)
module.exports = usermodel