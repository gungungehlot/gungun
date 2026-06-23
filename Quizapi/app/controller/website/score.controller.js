var jwt = require('jsonwebtoken');
const scoremodel = require('../../modals/score');
const { request } = require('express');
var secretkey = '123456'
exports.savescore = async (request, response) => {
  const token = request.headers.authorization?.split(' ');
    console.log(token)
    try {
        var verifytoken = jwt.verify(token[1], secretkey)
        console.log(verifytoken)
    } catch (error) {
        console.log(error)
        var apidata = {
            _status: false,
            _message: 'Token is Expired/Invalid',
            _is_token: 1,
            _data: ''
        }
        return response.send(apidata)
    }

    const Scoredata = request.body;

    if (request.body.score == '' || request.body.quizName == '') {
        var apidata = {
            _status: false,
            _message: 'All fields are required',
            _data: ''
        }
        return response.send(apidata)
    }

    Scoredata.userId = verifytoken._id

    scoremodel(Scoredata).save()
        .then((result) => {
            var apidata = {
                _status: true,
                _message: 'Score saved successfully',
                _data: result
            }
            response.send(apidata)

        })
        .catch((error) => {

            var errorMessage = {};
            for (var index in error.errors) {
                errorMessage[index] = error.errors[index].message;
            }

            var apidata = {
                _status: false,
                _message: 'something went wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}


 exports.getmyscore = async (request, response) => {

    const token = request.headers.authorization?.split(' ');
    try {
        var verifytoken = jwt.verify(token[1], secretkey)
    } catch (error) {
        var apidata = {
            _status: false,
            _message: 'Token is Expired/Invalid',
            _is_token: 1,
            _data: ''
        }
        return response.send(apidata)
    }

    scoremodel.find({ userId:
         verifytoken._id ,
         Delete_at : null
        })
        .sort({ date: -1 })
        .then((result) => {

            var apidata = {
                _status: true,
                _message: 'Score fetched successfully',
                _data: result
            }
            response.send(apidata)

        })
        .catch((error) => {

            var apidata = {
                _status: false,
                _message: 'something went wrong',
                _data: ''
            }
            response.send(apidata)
        })
    }

exports.destroy = async(request,response)=>{
    const Scoredata = {}
    Scoredata.Delete_at = Date.now();
    scoremodel.updateMany(
        {
       _id : request.body.id 
       },
    {
        $set : Scoredata
    }
)
.then((result)=>{
    var apidata = {
        _status : true,
        _message : 'Record delete sucessfully',
        _data : result
    }
    response.send(apidata)
    console.log(apidata)
})
.catch((error)=>{
    var errorMessage = {}
    for(var index in error.errors){
        errorMessage[index] = error.errors[index].message
    }
    var apidata = {
        _status : false,
        _message : 'something went wrong',
        _error : errorMessage,
        _data : ''
    }
    response.send(apidata)
})
}