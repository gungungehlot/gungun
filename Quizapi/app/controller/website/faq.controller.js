const { request, response } = require("express");
const faqmodel = require("../../modals/faq");

exports.create = async(request,response)=>{
    const savedata = request.body;
     if(request.file){
        console.log(request.file)
        if(request.file.filename){
            console.log(request.file.filename)
            console.log('hello')
            savedata.image = request.file.filename
        }
        console.log(savedata.image)
    }
    // console.log(request.body)

    faqmodel(savedata).save()
    .then((result)=>{
        var data = {
        _status:true,
        _message:'Record create sucessfully',
        'image' : process.env.testimonial_image,
        _data : result
        }
        response.send(data)
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

exports.view = async(request,response)=>{
    var page = 1
    var limit =20

    if(request.body){
        if(request.body.page != undefined && request.body.page != ''){
            page = request.body.page
        }
        // console.log(request.body.page)
        if(request.body.page != undefined && request.body.page != ''){
            limit = request.body.limit
        }
        // console.log(request.body.limit)
    }
      var skip = (page-1)*limit
     var array = [
            {
                Delete_at : null
            }
        ]
        var faq ;
        if(array.length > 0){
            var faq ={
            $and : array
            }
        }
        var totalrecords = await faqmodel.find(faq).countDocuments()

        var paginate = {
            currentpage :page,
            totalpages : Math.ceil(totalrecords/limit),
            totalRecords : totalrecords
        }

        faqmodel.find(faq)
        .limit(limit)
        .skip(skip)
         .sort({
            _id : "desc"
        })
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
            var errorMessage = {}
            for(var index in error.errors){
            errorMessage[index]=error.errors[index].message;
        }
        var apidata = {
            _status : false,
            _message : 'Something Went Wrong',
            _error : errorMessage,
            _data : []
        }
            response.send(apidata)    
        }) 
}

exports.update = async (request,response)=>{
    const savedata = request.body;
    savedata.Update_at = Date.now()
    console.log(savedata)
    faqmodel.updateOne(
        {
            _id : request.params.id
        },
        {
            $set : savedata
        }
    )
     .then((result)=>{
        var data = {
        _status:true,
        _message:'Record update sucessfully',
        _data : result
        }
        response.send(data)
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

exports.details = async(request,response)=>{
    faqmodel.findOne({
        _id: request.params.id
    })
    .then((result)=>{
        var apidata = {
            _status : true,
            _message : 'Details fetch Sucessfully',
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

exports.changestatus = async(request,response)=>{
    faqmodel.updateMany(
        {
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
            _status :true,
            _message : 'Status Changed Sucessfully',
            _data  : result
        }
        response.send(apidata)
    })
    .catch((error)=>{
        var errorMessage = {};
         for(var index in error.errors){
            errorMessage[index]=error.errors[index].message;
        }

        var apidata = {
            _status : false,
            _message :'something went wrong',
            _error : errorMessage,
            _data : []
        }
        response.send(apidata)
    })
}

exports.destroy = async(request,response)=>{
    const savedata  = {}
    savedata.Delete_at = Date.now()
faqmodel.updateMany({
    _id : request.body.ids
},
{
    $set:savedata
}
)

.then((result)=>{
    var apidata = {
        _status : true,
        _message :'Record delete sucessfully',
        _data : result
    }
    response.send(apidata)
})
.catch((error)=>{
    var errorMessage = {}
    for(var index in error.errors){
        errorMessage[index]=error.errors[index].message
    }
    var apidata = {
        _status : false,
        _message :'something went wrong',
        _error : errorMessage,
        _data : ''
    }
    response.send(apidata)
})
}