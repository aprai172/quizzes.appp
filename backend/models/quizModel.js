const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  text: { type: String, required: false },
  imageUrl: { type: String, required: false }
}, { _id: false });

const questionSchema = new Schema({
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [optionSchema],
    required: true
  },
  answer: {
    type: String,
    required: function() {
      return this.type === 'Q&A';
    }
  },
  timer: {
    type: String,
    enum: ['off', '5', '10'],
    default: 'off'
  },
  optionType: {
    type: String,
    enum: ['text', 'imageUrl', 'textImageUrl'],
    default: 'text'
  }
}, { _id: false });

const quizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Q&A', 'Poll'],
    required: true
  },
  questions: {
    type: [questionSchema],
    validate: [questionsLimit, '{PATH} exceeds the limit of 5']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  impressions: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

function questionsLimit(val) {
  return val.length <= 5;
}

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
