import React from 'react';

const TopicList = ({ topics, onSelectTopic }) => {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-center mb-6">Available Topics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div key={topic.id} className="p-4 bg-custom-green rounded-lg shadow hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => onSelectTopic(topic.id)}>
            <h3 className="text-1xl font-bold text-center text-white">{topic.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicList;
