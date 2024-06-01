const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false // Anonymous users can submit quizzes too
  },
  answers: [{
    question: {
      type: String,
      required: true
    },
    selectedOption: {
      type: String,
      required: true
    }
  }],
  score: {
    type: Number,
    required: function() {
      return this.quiz.type === 'Q&A';
    }
  }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
