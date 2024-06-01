const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoute");
const quizRoutes = require("./routes/quizRoute");
const submissionRoutes = require("./routes/submissionRoute");
const impressionRoutes = require("./routes/impressionRoute");

dotenv.config();  // Load environment variables early

const app = express();
const PORT = process.env.PORT || 5000; // Default port

// Middleware
app.use(cors());
app.use(express.json());  // Replaces body-parser
app.use(express.urlencoded({ extended: false }));  // Replaces body-parser

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/impressions", impressionRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
