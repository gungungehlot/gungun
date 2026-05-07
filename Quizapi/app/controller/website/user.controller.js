var jwt = require('jsonwebtoken')
var secretkey = '12345678'
const bcrypt = require('bcrypt');
const adminmodel = require('../../modals/user');
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const { request } = require('express');
// passconvert varaible password ko 10 bar convert krega
const passconvert = 10;

exports.register = async(request,response)=>{

    const userdata = request.body;

    console.log(request.body)

    if(request.body){
     const checkemail = await adminmodel.findOne({email: request.body.email ,Delete_at : null,  role_type : 'user'})
     if(checkemail){
        var data = {
            _status : false,
            _message : 'Email id  is Already exist',
            _data : ''
        }
        response.send(data)
     }
     if(request.body.password != ''){
        userdata.password = await bcrypt.hash(request.body.password,passconvert)
     }
    }
    adminmodel(userdata).save()
      .then((result)=>{
        var apidata = {
            _status : true,
            _message  : 'Registration  Sucessfully in Website',
            _data : result
        }
        response.send(apidata)
    })
  .catch((error)=>{
        var errorMessage  = {};
        for(var index in error.errors){
            errorMessage[index]=error.errors[index].message;
        }
      var data = {
        _status:false,
        _message:'something went wrong',
        _error : errorMessage,
        _data : ''
        }
        response.send(data)   
    }) 
}

exports.login = async(request,response)=>{
    if(request.body){
        const checkemail = await adminmodel.findOne({ email : request.body.email ,Delete_at : null,  role_type : 'user'});
        console.log(checkemail)
        if(!checkemail){
            var data = {
                _status : false,
                _message : 'email id does not exist',
                _data : ''
            }
            response.send(data)
        }
        var checkpassword = await bcrypt.compare(request.body.password,checkemail.password)
        if(!checkpassword){
            var data = {
                _status : false,
                _message : 'Password is inocorrect',
                _data : ''
            }
            response.send(data)
        }
        if(checkemail.status == 0){
            var data = {
                _status : false,
                _message : 'Account deactivate',
                _data : ''
            }
            response.send(data)
        }
        var token = jwt.sign({userinfo : checkemail},secretkey)
        var apidata = {
            _status : true,
            _message : 'login sucessfull',
            _token : token,
            _data : checkemail
        }
        response.send(apidata)
    }else{
        var apidata = {
            _status : false,
            _message : 'Required field missing',
            _data  : ''
        }
        response.send(apidata)
    }
}

exports.viewprofile = async (request, response) => {
    const token = request.headers.authorization.split(' ');
    console.log(token)
    try {
        var verifytoken = jwt.verify(token[1],secretkey)
        console.log(verifytoken)
    } catch (error) {
       const data = {
            _status: false,
            _message: 'Token is Experied/Invalid',
            _is_token: 1,
            _data: null
        }
        response.send(data) 
    }
    adminmodel.findOne({
            _id : verifytoken.userinfo._id,
            Delete_at : null,
            role_type : 'user'
        
})
      .then((result) => {
            if (result) {
                var data = {
                    _status: true,
                    _message: 'Data Fetch sucessfully',
                     'image': process.env.user_image,
                    _is_token: 0,
                    _data: result
                }
                response.send(data)
            }
            else {
                var data = {
                    _status: false,
                    _message: 'No Record Found',
                    _is_token: 0,
                    _data: ''
                }
                response.send(data)
            }
        })
        .catch((error) => {
            var errorMessage = {}

            for (var index in error.errors) {
                errorMessage[index] = error.erros[index].message
            }
            var data = {
                _status: true,
                _message: 'Something went wrong',
                _is_token: 0,
                _error: errorMessage,
                _data: null
            }
            response.send(data)
        })
}
exports.updateprofile = async (request, response) => {
    const token = request.headers.authorization.split(' ');


    try {
        var verifytoken = jwt.verify(token[1],secretkey)
    } catch (error) {
       const data = {
            _status: false,
            _message: 'Token is Experied/Invalid',
            _is_token: 1,
            _data: null
        }
        response.send(data) 
    }
    const checkemail = await adminmodel.findOne({email: request.body.email ,Delete_at : null,  role_type : 'user'})
     if(checkemail && verifytoken.userinfo.email != checkemail.email){
        var data = {
            _status : false,
            _message : 'Email id  is Already exist',
            _data : ''
        }
        response.send(data)
     }
     const Userdata = request.body

    if (request.file) {
        console.log('**')
        if (request.file.filename) {
            Userdata.image = request.file.filename
        }
    }
    adminmodel.updateOne(
    {
        _id : verifytoken.userinfo._id
    },
    {
        $set : Userdata
    }
)
.then((result)=>{
    var apidata = {
        _status : true,
        _message : 'User-Profile Updated Sucessfully',
        _data : result
    }
    response.send(apidata)
})
.catch((error)=>{
    const errorMessage = {}

    for(var index in error.errors){
        errorMessage[index] = error.errors[index].message
    }
    var apidata = {
        _status : false,
        _message : 'Something Went Wrong',
        _error : errorMessage,
        _data : null
    }
    response.send(apidata)
})

}
exports.changepassword = async (request, response) => {
  const token = request.headers.authorization.split(' ');


    try {
        var verifytoken = jwt.verify(token[1],secretkey)
    } catch (error) {
       const data = {
            _status: false,
            _message: 'Token is Experied/Invalid',
            _is_token: 1,
            _data: null
        }
        response.send(data) 
    }
     var checkpassword = await bcrypt.compare(request.body.Current_password,verifytoken.userinfo.password)
     if(!checkpassword){
         const data = {
            _status: false,
            _message: 'Current Password is Incorrect',
            _is_token: 1,
            _data: null
        }
        response.send(data)
     }
     if(request.body.Current_password == request.body.New_password){
         const data = {
            _status: false,
            _message: 'Current Password and new password cannot be same ',
            _is_token: 1,
            _data: null
        }
        response.send(data)
     }
    
     if(request.body.New_password != request.body.Conform_password){
         const data = {
            _status: false,
            _message: 'Current Password and new password Must be same ',
            _is_token: 1,
            _data: null
        }
        response.send(data)
     }

     const Userdata = {}
     Userdata.password = await bcrypt.hash(request.body.Conform_password,passconvert)

    adminmodel.updateOne(
    {
        _id : verifytoken.userinfo._id
    },
    {
        $set : Userdata
    }
)
.then((result)=>{
    var apidata = {
        _status : true,
        _message : 'Change Password Sucessfully',
        _is_token :0,
        _data : result
    }
    response.send(apidata)
})
.catch((error)=>{
    const errorMessage = {}

    for(var index in error.errors){
        errorMessage[index] = error.errors[index].message
    }
    var apidata = {
        _status : false,
        _message : 'Something Went Wrong',
        _error : errorMessage,
        _data : null
    }
    response.send(apidata)
})  
}
exports.forgotPassword = async (request, response) => {
  if (request.body) {
    const checkEmail = await adminmodel.findOne({
      email: request.body.email,
      deleted_at: null,
      role_type: "user",
    });

    if (!checkEmail) {
      const data = {
        _status: false,
        _message: "Email id do not exists.",
        _is_token: 0,
        _data: null,
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "gehlotgungun1@gmail.com",
          pass: 'pmwslzzwzampsmsc',
        },
      });
      const resetToken = jwt.sign(
        { email: checkEmail.email, userId: checkEmail._id },
        secretkey,
      );

      const resetLink = `http://localhost:5173/Reset/${resetToken}`;

      const info = transporter
        .sendMail({
          from: '"Quiz up" <gehlotgungun1@gmail.com>',
          to: request.body.email,
          subject: "Password Reset Request",
          text: `Click the link to reset your password: ${resetLink}`,
          html: `
                        <h2>Password Reset Request</h2>
                        <p>You have requested to reset your password. Please click the link below to proceed:</p>
                        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    `,
        })
        .then((result) => {
          console.log(result);
          const data = {
            _status: true,
            _message: "Email Sent successfully!",
            _data: result,
          };
          response.send(data);
        })
        .catch(() => {
          const data = {
            _status: true,
            _message: "Something went wrong!",
            _data: null,
          };
          response.send(data);
        });
    } catch (error) {
        console.log(error)
      const data = {
        _status: false,
        _message: "Something went wrong",
        _is_token: 0,
        _data: null,
      };
      response.send(data);
    }
  } else {
    const data = {
      _status: false,
      _message: "Email is required",
      _is_token: 0,
      _data: null,
    };
    response.send(data);
  }
};

exports.resetPassword = async (request, response) => {
  const token = request.headers.authorization.split(" ");
    console.log('token' ,token)
  if (
    !token[1] ||
    !request.body.new_password ||
    !request.body.confirm_password
  ) {
    const data = {
      _status: false,
      _message: "Token and password fields are required.",
      _is_token: 0,
      _data: null,
    };
    return response.send(data);
  }
  if (request.body.new_password !== request.body.confirm_password) {
    const data = {
      _status: false,
      _message: "New password and Confirm password should be same.",
      _is_token: 0,
      _data: null,
    };
    return response.send(data);
  }

  try {
    const verifyToken = jwt.verify(token[1], secretkey);
    console.log('verifytoken',verifyToken)
    const checkUser = await adminmodel.findOne({
      _id: verifyToken.userId,
      email: verifyToken.email,
      Delete_at: null,
      role_type: "user",
    });
    console.log('verify',verifyToken)
    console.log("chekuser:",checkUser)
    if (!checkUser) {
      const data = {
        _status: false,
        _message: "User not found.",
        _is_token: 0,
        _data: null,
      };
      return response.send(data);
    }
    const hashedPassword = await bcrypt.hash(
      request.body.new_password,
      passconvert,
    );
    console.log(passconvert);

  await adminmodel
      .updateOne(
        {
          _id: verifyToken.userId,
        },
        {
          $set: { password: hashedPassword },
        },
      )
      .then((result) => {
        const data = {
          _status: true,
          _message: "Password reset successfully.",
          _is_token: 0,
          _data: result,
        };
        response.send(data);
      })
      .catch(() => {
        const data = {
          _status: false,
          _message: "Something went wrong.",
          _is_token: 0,
          _data: null,
        };
        response.send(data);
      });
  } catch (error) {
    console.log(error)
    const data = {
      _status: false,
      _message: "Invalid or expired token.",
      _is_token: 1,
      _data: null,
    };
    return response.send(data);
  }
};


exports.view = async (request,response)=>{
    var page 
    var limit 
    if(request.body){
        if(request.body.page != '' && request.body.page != undefined){
        page = request.body.page
    }
        if(request.body.limit != '' && request.body.limit != undefined){
        limit = request.body.limit 
        }
    }
    var skip = (page-1)*limit

    var dataarray = [
        {
            Delete_at : null
        }
    ]

    if(request.body){
        if(request.body.name !='' && request.body.name !=undefined){
            dataarray.push(
                {
                    name : request.body.name
                }
            )
        }
    }
    if(dataarray.length >0){
        var user = {
            $and : dataarray
        }
    }
    var totalrecords = await adminmodel.find(user).countDocuments();
    var paginate = {
        currentpage: page,
        totalpages: Math.ceil(totalrecords / limit),
        totalRecords: totalrecords
    }
    adminmodel.find(user)
    .limit(limit)
    .skip(skip)
    .then((result)=>{
        if(result.length > 0){
            var apidata ={
                status : true,
                _message : ' Record Fetch Sucessfully',
                'image' : process.env.user_image,
                _paginate :paginate,
                _data : result
            }
            response.send(apidata)
        }
        else{
            var apidata = {
                _status : true,
                _message : 'No Record Found',
                _paginate :paginate,
                _data : []
            }
            response.send(apidata)
        }
    })
    .catch((error)=>{
        errorMessage = {};
        for(var index in error.errors){
            errorMessage[index] = error.errors[index].message 
        }
        var apidata = {
            _status : false,
            _message : 'Something went wrong',
            _data : []
        }
    })
}

exports.update = async (request,response)=>{
    const Userdata = request.body;
    if(request.file){
        if(request.file.filename){
            Userdata.image = request.file.filename
        }
    }
    Userdata. Update_at = Date.now()
    adminmodel.updateOne(
    {
        _id : request.params.id
    },
    {
        $set : Userdata
    }
)
.then((result)=>{
    var apidata = {
        _status : true,
        _message : 'Record Updated Sucessfully',
        _data : result
    }
    response.send(apidata)
})
.catch((error)=>{
    const errorMessage = {}

    for(var index in error.errors){
        errorMessage[index] = error.errors[index].message
    }
    var apidata = {
        _status : false,
        _message : 'Something Went Wrong',
        _error : errorMessage,
        _data : null
    }
    response.send(apidata)
})
}

exports.details = async(request,response)=>{
    adminmodel.findOne({
        _id : request.params.id
    })
    .then((result)=>{
        var apidata = {
            _status : true,
            _message : 'Details Fetch Sucesfully',
            'image' : process.env.user_image, 
            _data : result
        }
        response.send(apidata)
    })
    .catch((error)=>{
        var errorMessage = {}

        for(var index in error.erros){
            errorMessage[index] = error.errors[index].message
        }
        var apidata = {
            _status : false,
            _messag: 'Something Went Wrong',
            _data : ''
        }
        response.send(apidata)
    })
}

exports.changestatus = async(request,response)=>{
    console.log(request.body)
        adminmodel.updateMany({
        _id : request.body.ids
    },
    [
        {
        $set:{
            status:{
                $not : '$status'
            }
        }
    }
    ],
    {
        updatePipeline : true
    }
)
    .then((result)=>{
        var apidata = {
            _status : true,
            _message : ' Status Change sucesfully',
            _data : result
        }
        response.send(apidata)
        console.log(apidata)
    })
    .catch((error)=>{
        var errorMessage = {}
        for(var index in error.erros){
            errorMessage[index] = error.errors[index].message
        }
        var apidata = {
            _status : false,
            _message : 'Something went wrong',
            _error : errorMessage,
            _data: ''
        }
        response.send(apidata)
    })
}

exports.destroy = async (request,response)=>{
   const Userdata = {}
   Userdata.Delete_at = Date.now()
   adminmodel.updateMany(
    {
    _id : request.body.id
   },
   {
    $set : Userdata
   }
)
.then((result)=>{
    var apidata = {
        _status : true,
        _message : 'Record Delete Sucessfull',
        _data : result
    }
    response.send(apidata)
})
.catch((error)=>{
    var errorMessage = {}
    for(var index in error.erros){
        errorMessage[index] = error.erros[index].message
    }
    var apidata = {
        _status : false,
        _message : 'Something went wrong',
        _data : ''
    }
    response.send(apidata)
})

}