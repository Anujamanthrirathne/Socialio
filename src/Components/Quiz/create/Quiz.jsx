import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card, CardContent, Button, TextField, Typography, IconButton, Box, Grid, Paper, Divider, Collapse
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { API_BASE_URL } from '../../../Config/api';

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/quizzes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setQuizzes(res.data);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (r) => {
    e.preventDefault();
    const payload = { quizName, questions };

    if (editingId) {
      await axios.put(`${API_BASE_URL}/api/quizzes/${editingId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post(`${API_BASE_URL}/api/quizzes`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    setQuizName('');
    setEditingId(null);
    setQuestions([]);
    setShowForm(false);
    fetchQuizzes();
  };

  const handleEdit = (quiz) => {
    setQuizName(quiz.quizName);
    setEditingId(quiz.id);
    setQuestions(quiz.questions || []);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE_URL}/api/quizzes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchQuizzes();
  };

  return (
    <Box p={4}>
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          variant="contained"
          color="p"
          startIcon={<Add />}
          sx={{ mb: 3 }}
        >
          Create a New Quiz
        </Button>
      )}

      <Collapse in={showForm}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {editingId ? 'Edit Quiz' : 'Create a New Quiz'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Quiz Title"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" color="primary" gutterBottom>
              Quiz Questions
            </Typography>

            {questions.map((q, index) => (
              <Paper key={index} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }} elevation={1}>
                <Typography fontWeight="medium" mb={1}>
                  Question {index + 1}
                </Typography>
                <TextField
                  label="Question Text"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  {q.options.map((opt, optIdx) => (
                    <Grid item xs={6} key={optIdx}>
                      <TextField
                        label={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(index, optIdx, e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                  ))}
                </Grid>

                <TextField
                  label="Correct Answer Index (0-3)"
                  type="number"
                  value={q.correctAnswerIndex}
                  onChange={(e) => handleQuestionChange(index, 'correctAnswerIndex', parseInt(e.target.value))}
                  inputProps={{ min: 0, max: 3 }}
                  fullWidth
                  sx={{ mt: 2 }}
                  required
                />

                <TextField
                  label="Explanation"
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ mt: 2 }}
                />
              </Paper>
            ))}

            <Button
              onClick={handleAddQuestion}
              variant="outlined"
              startIcon={<Add />}
              color="secondary"
              sx={{ mb: 3 }}
            >
              Add Question
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" size="large" color="primary">
                {editingId ? 'Update Quiz' : 'Create Quiz'}
              </Button>
              <Button variant="text" color="error" onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setQuizName('');
                setQuestions([]);
              }}>
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Collapse>

      <Typography variant="h6" fontWeight="bold" mb={2}>Your Quizzes</Typography>
      <Grid container spacing={2}>
        {quizzes.map((quiz) => (
          <Grid item xs={12} md={6} lg={4} key={quiz.id}>
            <Card sx={{ borderRadius: 3, backgroundColor: '#f3f7fa' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">{quiz.quizName}</Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(quiz)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(quiz.id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuizManager;
