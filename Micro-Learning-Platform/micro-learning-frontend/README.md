# Micro-Learning Platform

This is a **React-based web application** designed as a micro-learning platform. Users can register, log in, attempt quizzes, and track their total score. Administrators can manage topics and questions.

## Installation

### Prerequisites:

1. Node.js installed on your machine.


### Steps:
1. Clone the repository:
   ```bash
    git clone https://github.com/Tejasgowda63/TejasR-WAD-Assignment.git
    cd TejasR-WAD-Assignment/Micro-Learning-Platform/micro-learning-frontend
   ```
2. Install dependencies:
   ```bash
   npm install react react-dom
   npm install react-router-dom
   npm install axios
   npm install jwt-decode
   npm install tailwindcss
   npx tailwindcss init
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## Folder Structure

```plaintext
src/
├── components/
│   ├── Navbar.js                   
│   ├── admin/
│   │   ├── AdminDashboard.js  
│   │   ├── AdminLogin.js      
│   │   ├── AddTopic.js      
│   │   └── AddQuestion.js   
│   └── user/
│       ├── Login.js           
│       ├── Register.js      
│       ├── TopicsList.js     
│       └── Quiz.js         
├── App.js                 
├── index.js              
├── styles/               
└── utils/                
```

---