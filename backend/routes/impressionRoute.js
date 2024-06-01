const express = require('express');
const Quiz = require('../models/quizModel');

const router = express.Router();

// Track quiz impressions
router.post('/:id/impression', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.impressions += 1;
    await quiz.save();
    res.status(200).json({ impressions: quiz.impressions });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
