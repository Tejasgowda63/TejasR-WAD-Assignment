import React, { useState } from 'react';

const Quiz = ({ quizQuestions, onSubmitQuiz }) => {
  const [answers, setAnswers] = useState([]);

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers({ ...answers, [questionId]: selectedAnswer });
  };
  
// Handle the submit button
  const handleSubmit = () => {
    onSubmitQuiz(answers);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quiz</h2>
      {quizQuestions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="font-semibold">{q.question_text}</p>
          {['option1', 'option2', 'option3', 'option4'].map((option, index) => {
          if (q[option]) {
          return (
          <label key={index} className="block">
          <input type="radio" name={`question_${q.id}`} value={q[option]} onChange={() => handleAnswerChange(q.id, q[option])} className="mr-2" />
          {q[option]} 
      </label>
    );
  }
  return null;
})}
</div> 
))}
      <button onClick={handleSubmit} className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-md"> Submit Quiz </button>
    </div>
  );
};

export default Quiz;
