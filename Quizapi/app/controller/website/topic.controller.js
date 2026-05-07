
const topicmodel = require("../../modals/topic")


exports.create = async(request,response)=>{
  
    const topicdata = request.body

    topicmodel(topicdata).save()
    .then((result)=>{
        var apidata = {
            _status :true,
            _message : 'Topic Create Sucessfully',
            _data : result
        }
        response.send(apidata)
    })
    .catch((error)=>{
        var errorMessage = {}
        for(var index in error.errors){
            errorMessage[index] = error.errors[index].message
        }
        var apidata = {
            _status : false,
            _message : 'Something went wrong',
            _error :errorMessage,
            _data :''
        }
        response.send(apidata)
    })
}

exports.view = async(request,response)=>{
    var page = 1
    var limit =5

    // for pagination
    if(request.body){
        if(request.body.page != '' && request.body.page != undefined){
            page = request.body.page
        }
        if(request.body.limit != '' && request.body.limit != undefined){
            limit = request.body.limit
        }
    }
    var skip = (page-1)*limit

    var dataarr = [
        {
            Delete_at : null
        }
    ]
    // for name filter
    if(request.body){
        if(request.body.name != '' && request.body.name != undefined){
            dataarr.push(
                    {
                        name : request.body.name
                    }
            )
        }
        console.log(request.body.name)
                        console.log('flter name')
    }
    if(dataarr.length > 0){
        var topic = {
            $and : dataarr
        }
    }
    var totalrecords = await topicmodel.find(topic).countDocuments()

    var paginate = {
        currentpage : page,
        totalpages : Math.ceil(totalrecords/limit),
        totalRecords : totalrecords
    }

    topicmodel.find(topic)
    .limit(limit)
    .skip(skip)
    .then((result)=>{
        if(result.length > 0){
            var apidata = {
                _status : true,
                _message : 'Record Fetch Sucessfully',
                _paginate : paginate,
                _data : result
            }
            response.send(apidata)
        }else{
            var apidata = {
                _status : false,
                _message : 'No Record Found',
                _data : []
        }
        response.send(apidata)  
    }    
    })
    .catch((error)=>{
        var errorMessage = {};

        for(var index in error.errors){
            errorMessage[index] = error.errors[index].message
        }
        var apidata = {
            _status : false,
            _message : 'Something went wrong',
            _error : errorMessage,
            _data : ''
        }
        response.send(apidata)
    })
}

exports.update = async(request,response)=>{
const topicdata = request.body
topicdata.Update_at = Date.now()

topicmodel.updateOne(
{
    _id : request.params.id
},
{
    $set : topicdata
}
)
.then((result)=>{
    var apidata = {
        _status : true,
        _message : 'Record Update Sucessfully',
        _data : result
    }
    response.send(apidata)
})
.catch((error)=>{
   var errorMessage = {};
        for(var index in error.errors){
            errorMessage[index] = error.errors[index].message
        }
        var apidata = {
            _status : false,
            _message : 'Something went wrong',
            _error : errorMessage,
            _data : ''
        }
        response.send(apidata)
    }) 
}

exports.details = async (request,response)=>{
    topicmodel.findOne({
        _id : request.params.id
    })
    .then((result)=>{
        var apidata = {
            _status : true,
            _message : 'Details Fetch sucessfully',
            _data : result
        }
        response.send(apidata)
    })
    .catch((error)=>{
   var errorMessage = {};
        for(var index in error.errors){
            errorMessage[index] = error.errors[index].message
        }
        var apidata = {
            _status : false,
            _message : 'Something went wrong',
            _error : errorMessage,
            _data : ''
        }
        response.send(apidata)
    }) 
}

exports.chnagestatus =async (request,response)=>{
    topicmodel.updateOne(
        {
        _id : request.body.id
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
        _message :'Status Change Sucessfully',
        _data : result
    }
    console.log(apidata)
    response.send(apidata)
})
.catch((error)=>{
    var errorMessage = {}

    for(var index in error.errors){
        errorMessage[index] = error.errors[index].message
    }
    var apidata = {
        _status : false,
        _message :'Something went wrong',
        _error : errorMessage,
        _data : ''
    }
    response.send(apidata)
})
}

exports.destroy = async (request , response)=>{
    const topicdata = {}
    topicdata.Delete_at = Date.now()
    topicmodel.updateMany(
        {
        _id : request.body.id
    },
    {
        $set : topicdata
    }
)
.then((result)=>{
    var apidata = {
        _status : true,
        _message : 'Record Delete Sucessfully',
        _data : result
    }
    response.send(apidata)
})
.catch((error)=>{
    var errorMessage = {}

    for(var index in error.errors){
        errorMessage[index] = error.errors[index].message
    }
    var apidata = {
       _status : false,
       _message : 'Soething went wrong',
       _error :errorMessage,
       _data : '' 
    }
    response.send(apidata)
})
}