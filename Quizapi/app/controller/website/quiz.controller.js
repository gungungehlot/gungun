const { response, request } = require('express');
const quizmodel = require('../../modals/quiz');
var slugify = require('slugify');
const activity = require('../../modals/activity');
const activitymodel = require('../../modals/activity');
require('dotenv').config()

const generateUniqueSlug = async (Model, baseSlug) => {
    let slug = baseSlug;
    let count = 0;

    // Loop to find unique slug
    while (await Model.findOne({ slug })) {
        count++;
        slug = `${baseSlug}-${count}`;
    }

    return slug;
};

exports.create = async (request, response) => {
    slugify(request.body.name, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: false,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })
    const Quizdata = request.body;
    if (request.file) {
        if (request.file.filename) {
            Quizdata.image = request.file.filename
        }
    }

    if (request.body.name != '') {
        var slug = slugify(request.body.name, {
            lower: true,
            strict: true,
        })

        Quizdata.slug = await generateUniqueSlug(quizmodel, slug)
    }

    Quizdata.Quizobj = {
        question1: {
            question: request.body.question1,
            answer: request.body.answer1,
            option: {
                option_a: request.body.option1a,
                option_b: request.body.option1b,
                option_c: request.body.option1c,
                option_d: request.body.option1d
            }
        },
        question2: {
            question: request.body.question2,
            answer: request.body.answer2,
            option: {
                option_a: request.body.option2a,
                option_b: request.body.option2b,
                option_c: request.body.option2c,
                option_d: request.body.option2d
            }
        },
        question3: {
            question: request.body.question3,
            answer: request.body.answer3,
            option: {
                option_a: request.body.option3a,
                option_b: request.body.option3b,
                option_c: request.body.option3c,
                option_d: request.body.option3d
            }
        },
        question4: {
            question: request.body.question4,
            answer: request.body.answer4,
            option: {
                option_a: request.body.option4a,
                option_b: request.body.option4b,
                option_c: request.body.option4c,
                option_d: request.body.option4d
            }
        },
        question5: {
            question: request.body.question5,
            answer: request.body.answer5,
            option: {
                option_a: request.body.option5a,
                option_b: request.body.option5b,
                option_c: request.body.option5c,
                option_d: request.body.option5d
            }
        },
        question6: {
            question: request.body.question6,
            answer: request.body.answer6,
            option: {
                option_a: request.body.option6a,
                option_b: request.body.option6b,
                option_c: request.body.option6c,
                option_d: request.body.option6d
            }
        },
        question7: {
            question: request.body.question7,
            answer: request.body.answer7,
            option: {
                option_a: request.body.option7a,
                option_b: request.body.option7b,
                option_c: request.body.option7c,
                option_d: request.body.option7d
            }
        },
        question8: {
            question: request.body.question8,
            answer: request.body.answer8,
            option: {
                option_a: request.body.option8a,
                option_b: request.body.option8b,
                option_c: request.body.option8c,
                option_d: request.body.option8d
            }
        },
        question9: {
            question: request.body.question9,
            answer: request.body.answer9,
            option: {
                option_a: request.body.option9a,
                option_b: request.body.option9b,
                option_c: request.body.option9c,
                option_d: request.body.option9d
            }
        },
        question10: {
            question: request.body.question10,
            answer: request.body.answer10,
            option: {
                option_a: request.body.option10a,
                option_b: request.body.option10b,
                option_c: request.body.option10c,
                option_d: request.body.option10d
            }
        }
    }
    console.log(Quizdata.Quizobj)
    quizmodel(Quizdata).save()
        .then((result) => {

            const adminId = request.admin?.userInfo?._id || request.admin?._id;
            console.log(adminId , 'adminid')

            activitymodel.create({
                adminId: adminId,
                action: 'Create Quiz',
                details: result.name
            });

            var apidata = {
                _status: true,
                _message: 'Quiz create successfully',
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

exports.view = async (request, response) => {
    var page = 1
    var limit = 30
    if (request.body) {
        if (request.body.page != '' && request.body.page != undefined) {
            page = request.body.page
        }
        if (request.body.limit != '' && request.body.limit != undefined) {
            limit = request.body.limit
        }
        if(request.body.topicid != '' && request.body.topicid != undefined){
            topicid = request.body.topicid
        }
    }
    var skip = (page - 1) * limit

    var datarr = [
        {
            Delete_at: null
        }
    ]
    if (request.body) {
        if (request.body.name != '' && request.body.name != undefined) {
            datarr.push(
                {
                    name: request.body.name
                }
            )
        }
    }
     if (request.body) {
        if (request.body.topicid != '' && request.body.topicid != undefined) {
            datarr.push(
                {
                    topicid: request.body.topicid
                }
            )
        }
    }
    if (request.body) {
        if (request.body._id != '' && request.body._id != undefined) {
            datarr.push(
                {
                    _id: request.body._id
                }
            )
        }
    }
    var Quiz
    if (datarr.length > 0) {
     Quiz = {
            $and: datarr
        }
    }
    var totalrecords = await quizmodel.find(Quiz).countDocuments()

    var paginate = {
        currentpage: page,
        totalpages: Math.ceil(totalrecords / limit),
        totalRecords: totalrecords
    }
    quizmodel.find(Quiz)
        .limit(limit)
        .skip(skip)
        .sort({
            _id: 'desc'
        })
         .populate('topicid','name')
        .then((result) => {
            if (result.length > 0) {
                var apidata = {
                    _status: true,
                    _message: 'Quiz data Fetch successfully',
                    'image': process.env.quiz_image,
                    _paginate: paginate,
                    _data: result
                }
                response.send(apidata)

            } else {
                var apidata = {
                    _status: false,
                    _message: 'No record found',
                    _data: []
                }
                response.send(apidata)
            }
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

exports.update = async (request, response) => {
    const Quizdata = request.body;

    if (request.body.name != '') {
        var slug = slugify(request.body.name, {
            lower: true,
            strict: true,
        })

        Quizdata.slug = await generateUniqueSlug(quizmodel, slug)
    }
    Quizdata.Quizobj = {
        question1: {
            question: request.body.question1,
            answer: request.body.answer1,
            option: {
                option_a: request.body.option1a,
                option_b: request.body.option1b,
                option_c: request.body.option1c,
                option_d: request.body.option1d
            }
        },
        question2: {
            question: request.body.question2,
            answer: request.body.answer2,
            option: {
                option_a: request.body.option2a,
                option_b: request.body.option2b,
                option_c: request.body.option2c,
                option_d: request.body.option2d
            }
        },
        question3: {
            question: request.body.question3,
            answer: request.body.answer3,
            option: {
                option_a: request.body.option3a,
                option_b: request.body.option3b,
                option_c: request.body.option3c,
                option_d: request.body.option3d
            }
        },
        question4: {
            question: request.body.question4,
            answer: request.body.answer4,
            option: {
                option_a: request.body.option4a,
                option_b: request.body.option4b,
                option_c: request.body.option4c,
                option_d: request.body.option4d
            }
        },
        question5: {
            question: request.body.question5,
            answer: request.body.answer5,
            option: {
                option_a: request.body.option5a,
                option_b: request.body.option5b,
                option_c: request.body.option5c,
                option_d: request.body.option5d
            }
        },
        question6: {
            question: request.body.question6,
            answer: request.body.answer6,
            option: {
                option_a: request.body.option6a,
                option_b: request.body.option6b,
                option_c: request.body.option6c,
                option_d: request.body.option6d
            }
        },
        question7: {
            question: request.body.question7,
            answer: request.body.answer7,
            option: {
                option_a: request.body.option7a,
                option_b: request.body.option7b,
                option_c: request.body.option7c,
                option_d: request.body.option7d
            }
        },
        question8: {
            question: request.body.question8,
            answer: request.body.answer8,
            option: {
                option_a: request.body.option8a,
                option_b: request.body.option8b,
                option_c: request.body.option8c,
                option_d: request.body.option8d
            }
        },
        question9: {
            question: request.body.question9,
            answer: request.body.answer9,
            option: {
                option_a: request.body.option9a,
                option_b: request.body.option9b,
                option_c: request.body.option9c,
                option_d: request.body.option9d
            }
        },
        question10: {
            question: request.body.question10,
            answer: request.body.answer10,
            option: {
                option_a: request.body.option10a,
                option_b: request.body.option10b,
                option_c: request.body.option10c,
                option_d: request.body.option10d
            }
        }
    }

    Quizdata.Update_at = Date.now();
    quizmodel.updateOne(
        {
            _id: request.params.id
        },
        {
            $set: Quizdata
        }
    )
        .then((result) => {

            const adminId = request.admin?.userInfo?._id || request.admin?._id;
            activitymodel.update({
                adminId: adminId,
                action: 'Update Quiz',
                details: result.name
            });

            var apidata = {
                _status: true,
                _message: 'Record update sucesfully',
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
                _message: 'Something Went Wrong',
                _error: errorMessage,
                _data: ''
            }
            response.send(apidata)
        })
}

exports.details = async (request, response) => {
    quizmodel.findOne({
        _id: request.params.id
    })
        .then((result) => {
            var apidata = {
                _status: true,
                _message: 'Detail Feth Sucessfully',
                'image': process.env.quiz_image,
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
                _message: 'Something went wrong',
                _data: ''
            }
            response.send(apidata)
        })
}

exports.changestatus = async (request, response) => {
    quizmodel.updateMany(
        {
            _id: request.body.id
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
        .then(async(result) => {

            
        const adminId = request.admin?.userInfo?._id || request.admin?._id;


        const quiz = await quizmodel.findById(request.body.id);

        await activitymodel.create({
            adminId: adminId,
            action: quiz.status ? 'Activate Quiz' : 'Deactivate Quiz',
            details: quiz.name
        });
            var apidata = {
                _status: true,
                _message: 'Status Changed Successfully',
                _data: result
            }
            response.send(apidata)
        })
        .catch((error) => {
            var errorMessage = {}
            for (var index in error.errors) {
                errorMessage[index] = error.errors[index].message
            }
        })
}

exports.destroy = async (request, response) => {
    const Quizdata = {}
    Quizdata.Delete_at = Date.now()
    quizmodel.updateMany(
        {
            _id: request.body.id
        },
        {
            $set: Quizdata
        }
    )
        .then((result) => {
            const adminId = request.admin?.userInfo?._id || request.admin?._id
            activitymodel.create({
                adminId: adminId,
                action: 'Delete Quiz',
                details: "Quiz deleted"
            });

            var apidata = {
                _status: true,
                _message: 'Record delete sucesfully',
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
                _status: true,
                _message: 'Something went wrong',
                _data: ''
            }
            response.send(apidata)
        })
}