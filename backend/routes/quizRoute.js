const express = require('express');
const auth = require('../middlewares/auth');
const Quiz = require('../models/quizModel');
const Impression = require('../models/impressionModel');

const router = express.Router();
router.post('/', auth, async (req, res) => {
  const { title, type, questions } = req.body;

  if (!Array.isArray(questions)) {
    return res.status(400).json({ message: 'Questions must be an array' });
  }

  if (questions.length > 5) {
    return res.status(400).json({ message: 'Cannot have more than 5 questions' });
  }

  for (const question of questions) {
    if (!Array.isArray(question.options) || question.options.length === 0) {
      return res.status(400).json({ message: 'Each question must have non-empty options' });
    }

    if (question.optionType === 'text' || question.optionType === 'textImageUrl') {
      for (const option of question.options) {
        if (!option.text || typeof option.text !== 'string') {
          return res.status(400).json({ message: 'Each option must have non-empty text' });
        }
      }
    }

    if (question.optionType === 'imageUrl' || question.optionType === 'textImageUrl') {
      for (const option of question.options) {
        if (!option.imageUrl || typeof option.imageUrl !== 'string') {
          return res.status(400).json({ message: 'Each option must have a valid imageUrl' });
        }
      }
    }

    if (question.optionType === 'textImageUrl') {
      for (const option of question.options) {
        if (!option.text || typeof option.text !== 'string' || !option.imageUrl || typeof option.imageUrl !== 'string') {
          return res.status(400).json({ message: 'Each option must have both non-empty text and a valid imageUrl' });
        }
      }
    }
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
    res.status(500).json({ message: error.message });
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

  if (!Array.isArray(questions)) {
    return res.status(400).json({ message: 'Questions must be an array' });
  }

  if (questions.length > 5) {
    return res.status(400).json({ message: 'Cannot have more than 5 questions' });
  }

  for (const question of questions) {
    if (!Array.isArray(question.options) || question.options.length === 0) {
      return res.status(400).json({ message: 'Each question must have non-empty options' });
    }

    if (question.optionType === 'text' || question.optionType === 'textImageUrl') {
      for (const option of question.options) {
        if (!option.text || typeof option.text !== 'string') {
          return res.status(400).json({ message: 'Each option must have non-empty text' });
        }
      }
    }

    if (question.optionType === 'imageUrl' || question.optionType === 'textImageUrl') {
      for (const option of question.options) {
        if (!option.imageUrl || typeof option.imageUrl !== 'string') {
          return res.status(400).json({ message: 'Each option must have a valid imageUrl' });
        }
      }
    }

    if (question.optionType === 'textImageUrl') {
      for (const option of question.options) {
        if (!option.text || typeof option.text !== 'string' || !option.imageUrl || typeof option.imageUrl !== 'string') {
          return res.status(400).json({ message: 'Each option must have both non-empty text and a valid imageUrl' });
        }
      }
    }
  }

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update the quiz with new data
    quiz.title = title;
    quiz.type = type;
    quiz.questions = questions;
    quiz.updatedBy = req.user._id;  // Assuming you want to keep track of who updated the quiz

    const updatedQuiz = await quiz.save();
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
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