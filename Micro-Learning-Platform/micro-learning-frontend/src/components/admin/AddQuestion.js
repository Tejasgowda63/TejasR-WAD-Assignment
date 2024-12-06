import React, { useState, useEffect } from "react";
import axios from "axios";

const AddQuestion = () => {
  const [topics, setTopics] = useState([]);
  const [questionData, setQuestionData] = useState({
    topicId: "",
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
  });

  // Getting topics from the server
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get("http://13.235.83.147:5000/topics", { headers: { Authorization: `Bearer ${token}` }, });
        setTopics(response.data);
      } catch (err) {
        alert("Failed to fetch topics");
      }
    };
    fetchTopics();
  }, []);

  const handleAddQuestion = async () => {
    if (!questionData.topicId) {
      alert("Please select a topic!");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post("http://13.235.83.147:5000/admin/add-question",
        questionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert("Question added successfully!");
        setQuestionData({
          topicId: "",
          questionText: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctAnswer: "",
        });
      }
    } catch (err) {
      console.error("Failed to add question:", err);
      alert("Failed to add question");
    }
  };

  return (
    <div className="mt-10 bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Add Question</h2>
        <select value={questionData.topicId} onChange={(e) => setQuestionData({ ...questionData, topicId: e.target.value })
          } className="w-full mb-4 p-2 border rounded-md">
          <option value="" disabled required>
            Select a Topic
          </option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        <textarea required placeholder="Question Text" value={questionData.questionText} onChange={(e) => setQuestionData({ ...questionData, questionText: e.target.value })
          } className="w-full mb-4 p-2 border rounded-md" />
        {["option1", "option2", "option3", "option4"].map((option, index) => (
          <input required key={index} type="text" placeholder={`Option ${index + 1}`} value={questionData[option]}
          onChange={(e) => setQuestionData({ ...questionData, [option]: e.target.value }) }
            className="w-full mb-4 p-2 border rounded-md"/>
        ))}
        <input required type="text" placeholder="Correct Answer" value={questionData.correctAnswer}
          onChange={(e) => setQuestionData({ ...questionData, correctAnswer: e.target.value })}
          className="w-full mb-4 p-2 border rounded-md"/>
        <button onClick={handleAddQuestion} className="w-full py-2 bg-green-600 text-white rounded-md">
          Add Question
        </button>
      </div>
    </div>
  );
};

export default AddQuestion;
