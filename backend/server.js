const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoute');
const quizRoutes = require('./routes/quizRoute');
const submissionRoutes = require('./routes/submissionRoute');
const impressionRoutes = require('./routes/impressionRoute');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://jhonwatson172:cyRmoBpbVRvgW8Dz@quizes.19utsez.mongodb.net/?retryWrites=true&w=majority&appName=quizes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.send('ffdfdff')
})

app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/impressions', impressionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
