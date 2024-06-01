const express = require("express");
const Quiz = require("../models/quizModel");
const Submission = require("../models/submissionModel");
const auth = require("../middlewares/auth");

const router = express.Router();

// Submit quiz answers
router.post("/:id/submit", async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    if (quiz.type === "Q&A") {
      score = answers.reduce((acc, answer) => {
        const question = quiz.questions.find(
          (q) => q.questionText === answer.question
        );
        return acc + (question.answer === answer.selectedOption ? 1 : 0);
      }, 0);
    }

    const newSubmission = new Submission({
      quiz: quizId,
      answers,
      score: quiz.type === "Q&A" ? score : undefined,
    });

    await newSubmission.save();
    res.status(201).json({ submission: newSubmission, score });
  } catch (Error) {
    res.status(500).json({ Error });
  }
});

router.get("/qa/:id", auth, async (req, res) => {
  try {
    const quizId = req.params.id;
    const submissions = await Submission.find({ quiz: quizId }).populate(
      "quiz",
      "title type questions"
    );
    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for the specified quiz" });
    }

    const quizStats = submissions.reduce((acc, submission) => {
      if (submission.quiz.type === "Q&A") {
        const quizId = submission.quiz._id.toString();
        if (!acc[quizId]) {
          acc[quizId] = {
            title: submission.quiz.title,
            questions: submission.quiz.questions.map((question) => ({
              questionText: question.questionText,
              totalAttendees: 0,
              totalCorrectAnswers: 0,
              totalWrongAnswers: 0,
            })),
          };
        }

        submission.answers.forEach((answer) => {
          const questionStats = acc[quizId].questions.find(
            (q) => q.questionText === answer.question
          );
          const question = submission.quiz.questions.find(
            (q) => q.questionText === answer.question
          );
          if (question && questionStats) {
            questionStats.totalAttendees += 1;
            if (question.answer === answer.selectedOption) {
              questionStats.totalCorrectAnswers += 1;
            } else {
              questionStats.totalWrongAnswers += 1;
            }
          }
        });
      }

      return acc;
    }, {});

    res.status(200).json({ quizStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/poll/:id", auth, async (req, res) => {
  try {
    const quizId = req.params.id;
    const submissions = await Submission.find({ quiz: quizId }).populate(
      "quiz",
      "title type questions"
    );
    if (!submissions.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for the specified quiz" });
    }

    const quizStats = submissions.reduce((acc, submission) => {
      if (submission.quiz.type === "Poll") {
        const quizId = submission.quiz._id.toString();
        if (!acc[quizId]) {
          acc[quizId] = {
            title: submission.quiz.title,
            questions: submission.quiz.questions.map((question) => ({
              questionText: question.questionText,
              totalAttendees: 0,
              optionsSelected: question.options
                ? question.options.reduce((optAcc, option) => {
                    optAcc[option.text] = 0; // Initialize option count with text as key
                    return optAcc;
                  }, {})
                : {},
            })),
          };
        }

        submission.answers.forEach((answer) => {
          const questionStats = acc[quizId].questions.find(
            (q) => q.questionText === answer.question
          );
          const question = submission.quiz.questions.find(
            (q) => q.questionText === answer.question
          );
          if (question && questionStats) {
            questionStats.totalAttendees += 1;
            if (
              questionStats.optionsSelected.hasOwnProperty(
                answer.selectedOption
              )
            ) {
              questionStats.optionsSelected[answer.selectedOption] += 1;
            }
          }
        });
      }

      return acc;
    }, {});

    res.status(200).json({ quizStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
