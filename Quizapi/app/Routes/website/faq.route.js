const express = require('express');
const { create, view, update, details, changestatus, destroy } = require('../../controller/website/faq.controller');
const multer = require('multer')
const upload = multer({ dest: 'uploads/testimonial' })
const path  = require ('path')
const route = express.Router();

module.exports=app=>{
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/testimonial')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
route.post('/create',upload.single('image'),create)
route.post('/view',view)
route.put('/update/:id',update)
route.put('/details/:id',details)
route.put('/changestatus',changestatus)
route.put('/delete' ,destroy)
app.use('/api/website/faq',route)
}