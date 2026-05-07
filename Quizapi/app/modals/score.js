const mongoose = require('mongoose')

const schema = mongoose.Schema =
{
  quizId: {
    type: String,
    ref: "quizs"
  },
  quizName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  accuracy: {
    type: String
  },
  action: {
    type: String,
    default: "Quiz Played"
  },
  date: {
    type: Date,
    default: Date.now
  },
  Create_at: {
    type: Date,
    default: Date.now()
  },
  Update_at: {
    type: Date,
    default: Date.now()
  },
  Delete_at: {
    type: Date,
    default: null
  }
}
const scoremodel = mongoose.model('scores', schema)
module.exports = scoremodel