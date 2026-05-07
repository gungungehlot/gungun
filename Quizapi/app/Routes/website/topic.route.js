const express = require('express');
const { create, view, update, details, chnagestatus, destroy } = require('../../controller/website/topic.controller');

const route = express.Router()

module.exports=app=>{
route.post('/create',create)
route.post('/view',view)
route.put('/update/:id',update)
route.put('/detail/:id',details)
route.put('/changestatus',chnagestatus)
route.put('/delete',destroy)
app.use('/api/admin/topic',route)
}