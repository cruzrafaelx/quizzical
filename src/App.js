import './App.css';
import React from 'react';
import Landing from './Components/Landing';
import Quiz from './Components/Quiz';
import {useState, useEffect} from 'react'
import { nanoid } from 'nanoid';
import {decode} from 'html-entities'

function App() {

  //start state
  const [start, setStart] = useState(false)

  //questions state to store the retrieved questions
  const [questions, setQuestions] = useState([])

   //Function to toggle start
   const toggleStart = () => {
    setStart(prevStart => !prevStart)
  }

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


    //Array that holds the question in index 0 and answers arranged randomly 
    const questionAndAnswer = questions.map(question => {
      
      //Array of decoded incorrect answers
      let orderedArray = question.incorrect_answers.map(item => decode(item))
  
      const randomIndex = Math.floor(Math.random() * 4)

      //Insert decoded correct answer with a random index using splice
      orderedArray.splice(randomIndex, 0, decode(question.correct_answer))

      //Manually inserting the question in index 0
      return [question.question, ...orderedArray]
    })


  console.log(questionAndAnswer)
  

  return (
    <div className="App">
      {!start
       ? <Landing start={toggleStart} /> 
       : <Quiz quiz={questionAndAnswer}/>}
    </div>
  );
}

export default App;
