const express = require('express');
const auth = require('../middlewares/auth');
const Quiz = require('../models/quizModel');
const Impression = require('../models/impressionModel');

const router = express.Router();

// Create a new quiz
router.post('/', auth, async (req, res) => {
  const { title, type, questions } = req.body;

  if (questions.length > 5) {
    return res.status(400).json({ message: 'Cannot have more than 5 questions' });
  }

  const newQuiz = new Quiz({
    title,
    type,
    questions,
    createdBy: req.user._id  // Assuming req.user is set by the auth middleware
  });

  try {
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message:  error.message });
  }
});



// Get quiz details by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Edit a quiz
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, type, questions } = req.body;

  if (questions.length > 5) {
    return res.status(400).json({ message: 'Cannot have more than 5 questions' });
  }

  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Ensure that the user is the creator of the quiz
    if (quiz.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    quiz.title = title || quiz.title;
    quiz.type = type || quiz.type;
    quiz.questions = questions || quiz.questions;

    const updatedQuiz = await quiz.save();
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});


// Increment impression count
router.get('/:id/impressions', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    quiz.impressions += 1;
    await quiz.save();
    res.status(200).json({ impressions: quiz.impressions });
  } catch (error) {
    res.status(500).json({ message:  error.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message:  error.message });
    console.error(error);
  }
});


router.delete('/:id', auth, async (req, res) => {
  const quizId = req.params.id;

  try {
    // Find the quiz by ID and ensure it exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Ensure the authenticated user is the creator of the quiz
    if (quiz.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized to delete this quiz' });
    }

    // Delete the quiz using findByIdAndDelete
    await Quiz.findByIdAndDelete(quizId);
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

module.exports = router;