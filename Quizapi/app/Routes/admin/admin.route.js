const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/admin' })
const path  = require ('path');
const { register, login, viewprofile, updateprofile, changepassword, forgotpassword, view, update, details, changestatus, destroy, create, resetPassword, forgotPassword } = require('../../controller/admin/admin.contoller');
const authMiddleware = require('../../middleware/authmiddle');


const route =express.Router()

module.exports = app =>{
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/admin')
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
    route.put('/view-profile',viewprofile)
    route.put('/update-profile',upload.single('image'),updateprofile)
    route.put('/change-password',upload.none(),changepassword)
    route.put('/forgot-password',upload.none(),forgotPassword)
    route.put('/reset-password',upload.none(),resetPassword)
    route.post('/create',upload.single('image'),authMiddleware,create)
    route.post('/view',view)
    route.put('/update/:id',upload.single('image'),update)
    route.put('/details/:id',details)
    route.put('/changestatus',changestatus)
    route.put('/delete',destroy)
    app.use('/api/admin/user',route)
}