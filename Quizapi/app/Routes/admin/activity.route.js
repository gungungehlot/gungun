const express = require('express')
const { getActivity, deleteActivity } = require('../../controller/admin/activity.contoller')
const authMiddleware = require('../../middleware/authmiddle')




const route = express.Router()

 module.exports = app=>{
    route.post('/getactivity',authMiddleware,getActivity)
    route.put('/deleteactivity',deleteActivity)
    app.use('/api/admin/get',route)
 }