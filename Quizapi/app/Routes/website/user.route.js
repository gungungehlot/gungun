const express = require('express')
const multer = require('multer')
multer({ dest: 'uploads/user' })
const path  = require ('path');
const { register, login, view, update, details, destroy, changestatus, viewprofile, updateprofile, changepassword, forgotpassword, resetpassword, forgotPassword, resetPassword } = require('../../controller/website/user.controller');

const route =express.Router()

module.exports = app =>{
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/user')
      },
      filename: function (req, file, cb) {
        console.log(file)
        var ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix +ext)
      }
    })
    const upload = multer({ storage: storage })
    route.post('/register',upload.none(),register)
    route.post('/login',upload.none(),login)
    route.put('/viewprofile',viewprofile)
    route.put('/updateprofile',upload.single('image'),updateprofile)
    route.put('/changepassword',upload.none(),changepassword)
    route.put('/forgot-password',forgotPassword)
    route.put('/reset-password',upload.none(),resetPassword)
    route.post('/view',view)
    route.put('/update/:id',upload.single('image'),update)
    route.put('/details/:id',details)
    route.put('/changestatus',changestatus)
    route.put('/delete',destroy)
    app.use('/api/website/user',route)
}