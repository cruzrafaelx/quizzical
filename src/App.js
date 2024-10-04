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

  //correctAnswer state to store number of correct answers
  const [score, setScore] = useState(0)

  //submit state to toggle submit 
  const [submit, setSubmit] = useState(false)

  //newGame state 
  const [newGame, setNewGame] = useState(false)

  //allAnswered state
  const [isAllAnswered, setIsAllAnswered] = useState(false)

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
  },[newGame])


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
                      isHeld: false,
                      wasNotChosen: false
      
                    }
            
          })
      
          const randomIndex = Math.floor(Math.random() * 4)
    
          //Insert decoded correct answer with a random index using splice
          orderedArray.splice(randomIndex, 0, {
            key: nanoid(),
            value: decode(question.correct_answer),
            isCorrect: true,
            isHeld: false,
            wasNotChosen: false
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
            return key === item.key ? {...item, isHeld: !item.isHeld} : {...item, isHeld: false}
        }) : answer
      })
      setAnswers(prevAnswers => newAnswers)
  }

  //Function to handle the submit button
  function toggleSubmit(){

    let sum = 0

    //Tallies the score
    answers.forEach( answer => {
      answer.forEach( item => {
        if(item.isHeld && item.isCorrect){
          sum = sum + 1
        }
      })
    })
    
    //Changes the color of the correct answers if not chosen 
    const newArray = answers.map( answer => {
      return answer.map( item => {

        if(item.isCorrect && !item.isHeld){
          return {...item, wasNotChosen: !item.wasNotChosen}
        } 
        else{
          return item
        }
      })
    })


    setScore( prevScore => sum)
    setAnswers(prevAnswers => newArray)

    // if(!submit){
    //   
    // } 
    // else{
    //   initializeAnswers()
    // }
    setSubmit(!submit)
  }

  function toggleNewGame(){
    setNewGame(!newGame)
    setSubmit(!submit)
  }

  console.log(answers)
  console.log(score)
  
    //When you submit, you need to tally the score, but also, if the chosen answer is wrong, the isCorrect should be colored differently unless it is held and correct.

    //When you submit, you want the button to change to new game and show the score. 
    // Also when new game, you want your rawQuestions to be reinitialzed again.
    // The problem is, we are using the submit dependency to run the useEffect again.
    // now we have delcared a newGame state which we can use to be a dependency for the use effect. 
    //Problems: 
    //1. when we click the submit, the questions get rerendered immediately.
    // make sure, the rawQuestions only get re-initialized when New game is positive.  
    //render 2 buttons: submit and newGame, 
    //if submit state is false, show submit, if submit state is true, show new game.
    //if you click on submit, submit will be true showing new game button
    //if you click on new game, new game will be true, which will change useEffect, and it turns submit into false again, showing the submit button once more. 



    //2. the submit button can be clicked even if there is no answer
    //Make sure in every array, there is atleast one isHeld so button can be clicked. 


  
  return (
    <div className="App">
      {!start
       ? <Landing start={toggleStart} /> 
       : <Quiz answers={answers} 
               questions={questions} 
               toggle={toggleAnswer} 
               submitBtn={toggleSubmit}
               newGameBtn={toggleNewGame}
               submit={submit}
              //  newGameBtn={newgame}
         />
      }
    </div>
  );
}

export default App;