const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const impressionSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Impression = mongoose.model('Impression', impressionSchema);
module.exports = Impression;
