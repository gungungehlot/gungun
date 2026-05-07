const testimonialmodal = require("../../modals/testimonial")
require('dotenv').config()

exports.create = async(request,response)=>{
    const testimonialdata =request.body
    // console.log(request.body)
     if(request.file){
        console.log('hello')
        if(request.file.filename){
            console.log(request.file.filename)
            testimonialdata.image = request.file.filename
        }
    }

    testimonialmodal(testimonialdata).save()
    .then((result)=>{
        var apidata = {
            _status : true,
            _message: 'record create sucessfully',
            // 'image' : process.env.testimonial_image,
            _data : result
        }
        // console.log(process.env.testimonial_image)
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
exports.view = async(request,response)=>{
   var page = 1
   var limit = 5

    if(request.body){
        if(request.body.page != '' && request.body.page != undefined){
            page = request.body.page
            console.log(request.body.page,'page')
        }
        if(request.body.limit != '' && request.body.limit != undefined){
            limit = request.body.limit
            console.log(request.body.limit,'limit')
        }
    }
    var skip = (page-1)*limit
    console.log('skip', skip)

    var dataarr = [
        {
            Delete_at : null
        }
    ]
    if(request.body){
         if(request.body.name  != undefined && request.body.name !=''){
                dataarr.push(
                    {
                        name : request.body.name
                    }
                )
            }
            console.log(`filter name`)
    }
    if(dataarr.length > 0){
        var testimonial = {
            $and : dataarr
        }
    }
     var totalrecords = await testimonialmodal.find(testimonial).countDocuments()

        var paginate = {
            currentpage :page,
            totalpages : Math.ceil(totalrecords/limit),
            totalRecords : totalrecords
        }

        testimonialmodal.find(testimonial)
        .limit(limit)
        .skip(skip)
          .then((result)=>{
        if(result.length > 0){
            var apidata = {
                _status : true,
                _message : 'Record Fetch Sucessfully',
                'image' : process.env.testimonial_image,
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
        var errorMessage  = {};
        for(var index in error.errors){
        errorMessage[index]=error.errors[index].message;
        }

        var apidata = {
            _status :false,
            _message :'something went wrong',
            _error : errorMessage,
            _data : ''
        }
        response.send(apidata)
        })

}
exports.update = async(request,response)=>{
    const testimonialdata = request.body;
        if(request.file){
        console.log('hello')
        if(request.file.filename){
             console.log(request.file.filename)
            testimonialdata.image = request.file.filename
        }
    }
    testimonialdata.Update_at = Date.now()
     console.log('testimonial',testimonialdata)
    testimonialmodal.updateOne(
        {
            _id : request.params.id
        },
        {
            $set:testimonialdata
        }
    )
    .then((result)=>{
        var apidata = {
            _status :true,
            _message : 'Record Update Sucessfully',
            _data : result
        }
        response.send(apidata)
    })
    .catch((error)=>{
        var errorMessage = {}

        for(var index in error.errors){
            errorMessage[index] = error.errors[index].message
        }
        var apidata ={
            _Status : false,
            _message : 'Something went wrong',
            _error : errorMessage,
            _data : ''
        }
        response.send(apidata)
    })
}
exports.details = async(request,response)=>{
    testimonialmodal.findOne({
        _id : request.params.id
    })
    .then((result)=>{
        var apidata = {
            _status : true,
              'image' : process.env.testimonial_image,
            _message : 'Details fetch Sucessfully ',
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
            _message : 'something went wrong',
            _error : errorMessage,
            _data : ''
        }
        response.send(apidata)
    })
}
exports.changestatus = async(request,response)=>{
      testimonialmodal.updateMany(
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
        _status : true,
        _message : 'Status Change sucessfully',
        _data : result
    }
    response.send(apidata)
 })
 .catch((error)=>{
    var errormessage  = {}

    for(var index in error.errors){
        errormessage[index] = error.errors[index].message
    }
    var apidata= {
        _status : false,
        _message : 'something went wrong',
        _error : errormessage,
        _data :''
    }
    response.send(apidata)
 })
}
exports.destroy = async(request,response)=>{
    const testimonialdata = {}
    testimonialdata.Delete_at = Date.now();
    testimonialmodal.updateMany(
        {
       _id : request.body.id 
       },
    {
        $set : testimonialdata
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