const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/quiz' })
const path  = require ('path');
const { savescore, getmyscore, destroy } = require('../../controller/website/score.controller');


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

    route.post('/savescore',savescore)
    route.post('/viewscore',getmyscore)
    route.put('/deletescore',destroy)

    app.use('/website/score',route)
}