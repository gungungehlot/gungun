const express = require('express')
const mongoose = require('mongoose')
const cors =require('cors')
const bodyparser = require('body-parser')
const app = express();

app.get('/',(request,response)=>{
response.send('started working')
})

//add express urlencoded
app.use(express.urlencoded({extended:true}));
// cors
app.use(cors());
// for image uploader
app.use('/uploads/testimonial',express.static('uploads/testimonial'));
app.use('/uploads/quiz',express.static('uploads/quiz'));
app.use('/uploads/admin',express.static('uploads/admin'));
app.use('/uploads/user',express.static('uploads/user'));
// add body parser
app.use(bodyparser.json());

// website
require('./app/Routes/website/faq.route')(app)
require ('./app/Routes/website/testimonial.route')(app)
require('./app/Routes/website/topic.route')(app)
require('./app/Routes/website/quiz.route')(app)
require('./app/Routes/website/user.route')(app)
require('./app/Routes/website/score.route')(app)
// admin
require('./app/Routes/admin/admin.route')(app)
require('./app/Routes/admin/activity.route')(app)
app.listen(5000,()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/test')
   .then(() => console.log('Connected!'));
    console.log('server is working')
})