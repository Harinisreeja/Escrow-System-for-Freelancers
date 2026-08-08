const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
  },
  budget: {
    type: Number,
    required: [true, 'Please add a job budget'],
  },
  type: {
    type: String,
    enum: ['freelancer', 'fullTime', 'partTime'],
    default: 'freelancer',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', JobSchema);
