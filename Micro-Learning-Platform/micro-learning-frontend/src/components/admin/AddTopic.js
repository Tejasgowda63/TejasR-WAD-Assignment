import React, { useState } from "react";
import axios from "axios";

const AddTopic = () => {
  const [topicName, setTopicName] = useState("");

  const handleAddTopic = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("http://13.235.83.147:5000/admin/add-topic", { name: topicName },{ headers: { Authorization: `Bearer ${token}` } });
      alert("Topic added successfully!");
      setTopicName("");
    } catch (err) {
      alert("Failed to add topic");
    }
  };

  return (
    <div className="mt-10 bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Add Topic</h2>
        <input type="text" placeholder="Enter topic name" value={topicName} onChange={(e) => setTopicName(e.target.value)} className="w-full mb-4 p-2 border rounded-md" required/>
        <button onClick={handleAddTopic} className="w-full py-2 bg-green-600 text-white rounded-md"> Add Topic </button>
      </div>
    </div>
  );
};

export default AddTopic;
