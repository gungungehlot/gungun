const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/quiz' })
const path  = require ('path');
const { create, view, update, details, destroy, changestatus } = require('../../controller/website/quiz.controller');
const authMiddleware = require('../../middleware/authmiddle');


const route =express.Router()

module.exports = app =>{
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/quiz')
      },
      filename: function (req, file, cb) {
        console.log(file)
        var ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix +ext)
      }
    })
    const upload = multer({ storage: storage })
    route.post('/create',upload.single('image'),authMiddleware,create)
    route.post('/view',view)
    route.put('/update/:id',upload.single('image'),authMiddleware,update)
    route.put('/detail/:id',details)
    route.put('/changestatus',authMiddleware,changestatus)
    route.put('/delete',authMiddleware,destroy)

    app.use('/api/website/quiz',route)
}