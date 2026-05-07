const express = require ('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/testimonial' })
const path  = require ('path');
const { create, view, update, changestatus, details, destroy } = require('../../controller/website/testimonial.controller');

const route = express.Router();

module.exports=app=>{
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/testimonial')
  },
  filename: function (req, file, cb) {
    console.log(file)
    var ext = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix +ext)
  }
})

const upload = multer({ storage: storage })

route.post('/create',upload.single('image'),create)
route.post('/view', view)
route.put('/update/:id',upload.single('image'),update)
route.put('/changestatus',changestatus)
route.put('/details/:id',details)
route.put('/delete',destroy)
app.use('/api/website/testimonial',route)
}