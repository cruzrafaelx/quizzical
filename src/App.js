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


  //Function that changes the isHeld value when answer is clicked
  function toggleAnswer(key, index){

    const newAnswers = answers.map((answer, origIndex)  => {
      return index === origIndex ? 
        answer.map(item => {
          return key === item.key ? {...item, isHeld: !item.isHeld} : item
      }) : answer
    })

    setAnswers(prevAnswers => newAnswers )
  }

  


  return (
    <div className="App">
      {!start
       ? <Landing start={toggleStart} /> 
       : <Quiz answers={answers} questions={questions} toggle={toggleAnswer} />}
    </div>
  );
}

export default App;



//Create a toggleAnswer function
// pass this as a prop to quiz
// add the function to every answer
// If you click an answer, the index of the question and key of the answer should get passed as an argument
// we go back to App.js
// inside the toggleAnswer function,
// we map over the answer state, if the array does not match the index, it gets returned as it is, if it matches the index, we map over it,
//we iterate over the the corresponding answer state using the the passed key.
// make a ternary condition, if the key doesnt match, we pass it as it is, if it is not, we use the spread operator on every other property and the isHeld will be changed to true. 