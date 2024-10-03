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

  //rawQuestions state from the API
  const[rawQuestions, setRawQuestions] = useState([])
  
  //questions state to store the retrieved questions
  const [questions, setQuestions] = useState([])

  //answers state to store the retrieved answers
  const [answers, setAnswers] = useState([])

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

        setRawQuestions(data.results)
      } 
      
      catch (error) {
        console.error("Error fetching questions:", error);
      }}

      getQuestions()
      
    },[])

    console.log(rawQuestions)

    //useEffect to set answers and questions state only when rawQuestions are initialized after API retrieval
    useEffect(() => {

      //Check if API has been retrieved and rawQuestions has been filled
      if(rawQuestions.length > 0){

        //Set the questions based on rawQuestions
        setQuestions(rawQuestions.map(question => {
          return { key: nanoid(),
              value: decode(question.question)
            }
          
        }))

        //Set the answers based on rawQuestions
        setAnswers(
            rawQuestions.map(question => {

            //Array of decoded incorrect answers
            let orderedArray = question.incorrect_answers.map(item =>{
              return { key: nanoid(),
                       value: decode(item),
                       isCorrect: false,
                       isHeld: false
                      }
              
            })
        
            const randomIndex = Math.floor(Math.random() * 4)
      
            //Insert decoded correct answer with a random index using splice
            orderedArray.splice(randomIndex, 0, {
              key: nanoid(),
              value: decode(question.correct_answer),
              isCorrect: true,
              isHeld: false
            })
      
            return orderedArray
          }))
      }
    }, [rawQuestions])


  console.log(answers)
  console.log(questions)
  //Youre going to have to separate the question and answers again OR you need to find a way to render them all from a single array. The problem is that the number of answers to a question vary. Its not always 4 as initially thought. 

  return (
    <div className="App">
      {!start
       ? <Landing start={toggleStart} /> 
       : <Quiz answers={answers} questions={questions} />}
    </div>
  );
}

export default App;
