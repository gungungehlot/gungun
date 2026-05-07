var jwt = require('jsonwebtoken')
var secretkey = '123456'
require('dotenv').config()
const nodemailer = require('nodemailer')

const bcrypt = require('bcrypt');
const usermodel = require('../../modals/admin');
const activitymodel = require('../../modals/activity');
const crypto = require('crypto');
const { trace } = require('console');
const console = require('console');


// passconvert varaible password ko 10 bar convert krega
const passconvert = 10;

exports.register = async (request, response) => {

    const Userdata = request.body;
    console.log(request.body)
    if (request.body) {
        const checkemail = await usermodel.findOne({ email: request.body.email, Delete_at: null });
        if (checkemail) {
            var data = {
                _status: false,
                _message: 'This email id is already exist,',
                _data: ''
            }
            response.send(data)
        }
        if (request.body.password != '') {
            Userdata.password = await bcrypt.hash(request.body.password, passconvert)

        }
    }
    usermodel(Userdata).save()
        .then((result) => {
            var apidata = {
                _status: true,
                _message: 'Registration Submitted Sucessfully',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {};
            for (var index in error.errors) {
                errorMessage[index] = error.errors[index].message;
            }
            var data = {
                _status: false,
                _message: 'something went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(data)
        })
}

exports.login = async (request, response) => {

    if (request.body) {
        const checkemail = await usermodel.findOne({ email: request.body.email, Delete_at: null, role_type: 'admin' });
        if (!checkemail) {
            var data = {
                _status: false,
                _message: ' email id does not exist ! ',
                _data: null
            }
            response.send(data)
        }
        var checkpassword = await bcrypt.compare(request.body.password, checkemail.password)
        if (!checkpassword) {
            var data = {
                _status: false,
                _message: 'password is inncorect ! ',
                _data: null
            }
            response.send(data)
        }
        if (checkemail.status == 0) {
            var data = {
                _status: false,
                _message: 'your account is deactivate ! ',
                _data: null
            }

            response.send(data)
        }
        var token = jwt.sign({ userInfo: checkemail }, secretkey)
        var apidata = {
            _status: true,
            _message: ' Login Successful. Redirecting to your dashboard..',
            _token: token,
            _data: checkemail
        }
        console.log(checkemail)
        response.send(apidata)
    } else {
        var data = {
            _status: false,
            _mesage: 'Required filed missing',
            _data: ''
        }
        response.send(data)
    }
}
exports.viewprofile = async (request, response) => {
    const token = request.headers.authorization.split(' ');
    // console.log(jwt.verify(token, secretkey))
    try {
        var verifytoken = jwt.verify(token[1], secretkey)
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Token is Experied/Invalid',
            _is_token: 1,
            _data: null
        }
        response.send(data)
    }
    usermodel.findOne({
        _id: verifytoken.userInfo._id,
        Delete_at: null,
        role_type: 'admin'
    })
        .then((result) => {
            if (result) {
                var data = {
                    _status: true,
                    _message: 'Data Fetch sucessfully',
                    'image': process.env.admin_image,
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
    console.log(request.headers)
    try {
        var verifytoken = jwt.verify(token[1], secretkey)
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Token is Experied/Invalid',
            _is_token: 1,
            _data: null
        }
        response.send(data)
    }
    const checkemail = await usermodel.findOne({ email: request.body.email, Delete_at: null });
    if (checkemail && verifytoken.userInfo.email != checkemail.email) {
        var data = {
            _status: false,
            _message: 'This email id is already exist,',
            _data: ''
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
    usermodel.updateOne(
        {
            _id: verifytoken.userInfo._id
        },
        {
            $set: Userdata
        }
    )
        .then((result) => {
            var apidata = {
                _status: true,
                _message: 'Profile Update Sucessfuly',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.erros) {
                errorMessage[index] = error.errors[index].message
            }
            var apidata = {
                _status: false,
                _message: 'Somthing went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}
exports.changepassword = async (request, response) => {
    const token = request.headers.authorization.split(' ');
    console.log(token)
    try {
        var verifytoken = jwt.verify(token[1], secretkey)
        console.log(verifytoken.userInfo.password)
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Token is Experied/Invalid',
            _is_token: 1,
            _data: null
        }
        response.send(data)
    }

    var checkpassword = await bcrypt.compare(request.body.Current_password, verifytoken.userInfo.password)
    if (!checkpassword) {
        const data = {
            _status: false,
            _message: 'Current Password is Incorrect',
            _is_token: 1,
            _data: null
        }
        response.send(data)
    }

    if (request.body.Current_password == request.body.New_password) {
        const data = {
            _status: false,
            _message: 'Current Password and new password Cannot be same',
            _is_token: 1,
            _data: null
        }
        response.send(data)
    }

    if (request.body.New_password != request.body.Confrom_password) {
        const data = {
            _status: false,
            _message: 'Current Password and new password must be same',
            _is_token: 1,
            _data: null
        }
        response.send(data)
    }


    const Userdata = {}
    Userdata.password = await bcrypt.hash(request.body.Confrom_password, passconvert)
    console.log(Userdata)
    usermodel.updateOne(
        {
            _id: verifytoken.userInfo._id
        },
        {
            $set: Userdata
        }
    )
        .then((result) => {
            var apidata = {
                _status: true,
                _message: 'Password Change Sucessfully Sucessfuly',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.erros) {
                errorMessage[index] = error.errors[index].message
            }
            var apidata = {
                _status: false,
                _message: 'Somthing went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}



exports.create = async (request, response) => {
    const Userdata = request.body;
    if (request.body) {
        const checkemail = await usermodel.findOne({ email: request.body.email, Delete_at: null });
        if (checkemail) {
            var data = {
                _status: false,
                _message: 'This email id is already exist,',
                _data: ''
            }
            response.send(data)
        }
        if (request.body.password != '') {
            Userdata.password = await bcrypt.hash(request.body.password, passconvert)

        }
    }
    if (request.file) {
        console.log('hello')
        if (request.file.filename) {
            console.log(request.file.filename)
            Userdata.image = request.file.filename
        }
    }

    usermodel(Userdata).save()
        .then(async (result) => {
            try {
                const adminId = request.admin?._id || request.admin?.userInfo?._id;

                console.log("ADMIN ID ", adminId);

                if (adminId) {
                    activitymodel.create({
                        adminId: adminId,
                        action: 'Create Admin',
                        details: result.name
                    });
                }

            } catch (err) {
                console.log("ACTIVITY ERROR 👉", err.message);
            }
            var apidata = {
                _status: true,
                _mesage: 'Admin Create Sucessfully',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.erros) {
                errorMessage[index] = error.erros[index].message
            }
            var apidata = {
                _status: false,
                _mesage: 'Something went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}

exports.view = async (request, response) => {
    var page
    var limit
    if (request.body) {
        if (request.body.page != '' && request.body.page != undefined) {
            page = request.body.page
        }
        if (request.body.limit != '' && request.body.limit != undefined) {
            limit = request.body.limit
        }
    }
    var skip = (page - 1) * limit

    var dataarray = [
        {
            Delete_at: null
        }
    ]
    if (request.body) {
        if (request.body.name != '' && request.body.name != undefined) {
            dataarray.push(
                {
                    name: request.body.name
                }
            )
        }
    }
    if (dataarray.length > 0) {
        var admindata = {
            $and: dataarray
        }
    }
    var totalrecords = await usermodel.find(admindata).countDocuments();
    var paginate = {
        currentpage: page,
        totalpages: Math.ceil(totalrecords / limit),
        totalRecords: totalrecords
    }
    usermodel.find(admindata)
        .limit(limit)
        .skip(skip)

        .then((result) => {
            if (result.length > 0) {
                var apidata = {
                    _status: true,
                    _message: 'Record fetch successfully ',
                    'image': process.env.admin_image,
                    _paginate: paginate,
                    _data: result
                }
                response.send(apidata)
            }
            else {
                var apidata = {
                    _status: true,
                    _message: 'No record found',
                    _paginate: paginate,
                    _data: ''
                }
                response.send(apidata)
            }
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.errors) {
                errorMessage[index] = error.erros[index].message
            }
            var apidata = {
                _status: false,
                _message: 'Something went wrong',
                _error: errorMessage,
                _data: []
            }
            response.send(apidata)
        })
}

exports.update = async (request, response) => {
    if (request.file) {
        console.log('hello')
        if (request.file.filename) {
            console.log(request.file.filename)
            Userdata.image = request.file.filename
        }
    }
    //  if (request.body) {
    //     const checkemail = await usermodel.findOne({ email: request.body.email, Delete_at: null });
    //     if (checkemail) {
    //         var data = {
    //             _status: false,
    //             _message: 'This email id is already exist,',
    //             _data: ''
    //         }
    //         response.send(data)
    //     }
    // }

    const Userdata = request.body;
    Userdata.Update_at = Date.now()
    usermodel.updateOne(
        {
            _id: request.params.id
        }, {
        $set: Userdata
    }
    )
        .then((result) => {
            var apidata = {
                _status: true,
                _message: 'Record Update Sucessfuly',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.erros) {
                errorMessage[index] = error.errors[index].message
            }
            var apidata = {
                _status: false,
                _message: 'Somthing went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}

exports.details = async (request, response) => {
    usermodel.findOne({
        _id: request.params.id
    })
        .then((result) => {
            var apidata = {
                _status: true,
                _mesage: 'Details Fetch Sucessfully',
                'image': process.env.admin_image,
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.erros) {
                errorMessage[index] = error.errors[index].message
            }
            var apidata = {
                _status: false,
                _mesage: 'Something went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}

exports.changestatus = async (request, response) => {
    usermodel.updateMany({
        _id: request.body.ids
    },
        [
            {
                $set: {
                    status: {
                        $not: '$status'
                    }
                }
            }
        ],
        {
            updatePipeline: true
        }
    )
        .then((result) => {
            var apidata = {
                _status: true,
                _message: 'Status Changed Sucessfully',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.errors) {
                errorMessage[index] = error.errors[index].message
            }
            var apidata = {
                _status: false,
                _mesage: 'Something went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}

exports.destroy = async (request, response) => {
    const Userdata = {}
    Userdata.Delete_at = Date.now()
    usermodel.updateMany(
        {
            _id: request.body.id
        }, {
        $set: Userdata
    }
    )
        .then((result) => {
            var apidata = {
                _status: true,
                _mesage: 'Record Delete Sucessfully',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.errors) {
                errorMessage[index] = error.erros[index].message
            }
            var apidata = {
                _status: false,
                _message: 'Something went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}
exports.forgotPassword = async (request, response) => {
  if (request.body) {
    const checkEmail = await usermodel.findOne({
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
          from: '"Quizup website" <gehlotgungun1@gmail.com>',
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
    console.log(verifyToken)
    const checkUser = await usermodel.findOne({
      _id: verifyToken.userId,
      email: verifyToken.email,
    //   deleted_at: null,
    //   role_type: "admin",
    });
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

    await usermodel
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
    const data = {
      _status: false,
      _message: "Invalid or expired token.",
      _is_token: 1,
      _data: null,
    };
    return response.send(data);
  }
};

