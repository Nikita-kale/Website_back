const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000; // The port where the server will run

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse incoming requests with JSON payloads

// Connect to MongoDB (replace with your own connection string if using MongoDB Atlas)
mongoose.connect('mongodb+srv://Mywebsite:Nikita%402003@cluster1.bspg1.mongodb.net/feedbackDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

// Feedback Model
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Get all feedbacks (GET /feedbacks)
app.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).send("Error fetching feedbacks");
  }
});

// Add new feedback (POST /feedbacks)
app.post('/feedbacks', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.json(newFeedback);
  } catch (error) {
    res.status(500).send("Error adding feedback");
  }
});

// Delete feedback by ID (DELETE /feedbacks/:id)
app.delete('/feedbacks/:id', async (req, res) => {
  try {
      const feedbackId = req.params.id; // Get the feedback ID from the request parameters
      const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId); // Delete feedback by ID

      if (!deletedFeedback) {
          return res.status(404).json({ message: 'Feedback not found' }); // Handle case where feedback is not found
      }

      res.status(200).json({ message: 'Feedback deleted successfully.' }); // Successful deletion response
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send("Error deleting feedback"); // Internal server error
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
