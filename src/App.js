import './App.css';
import React from 'react';
import Landing from './Components/Landing';
import Questions from './Components/Questions';
import {useState, useEffect} from 'react'

function App() {

  //start state
  const [start, setStart] = useState(false)

  //questions state to store the retrieved questions
  const [questions, setQuestions] = useState([])

  //useEffect to handle API retrieval
  useEffect(() => {

    async function getQuestions(){
      console.log("Fetching questions...")
      try{
        const res = await fetch("https://opentdb.com/api.php?amount=5")
        console.log("Response status", res.status)

        if(!res.ok)throw new Error("Network response was not ok")

        const data = await res.json()
        console.log("Fetched data", data)

        setQuestions(data.results)
      } 
      
      catch (error) {
        console.error("Error fetching questions:", error);
      }}

      getQuestions()
      
    },[])


  //Function to toggle start
  const toggleStart = () => {
    setStart(prevStart => !prevStart)
  }

  //Array that holds the questions which will be passed as a prop to Questions.js
  const questionsArray = questions.map((question, index) =>{
      return <p key={index}>{question.question}</p>
  })

  return (
    <div className="App">
      {!start
       ? <Landing start={toggleStart} /> 
       : <Questions questions={questionsArray}/>}
    </div>
  );
}

export default App;
