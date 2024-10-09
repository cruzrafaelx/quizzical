import './App.css';
import React from 'react';
import Landing from './Components/Landing';
import Quiz from './Components/Quiz';
import {useState, useEffect} from 'react'
import { nanoid } from 'nanoid';
import {decode} from 'html-entities'
import { GridLoader } from 'react-spinners';

function App() {

  //loading state
  const [loading, setLoading] = useState(true)

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

    setLoading(true)

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
      }
      
      finally{
        setLoading(false)
      }
    }

     
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


   //Check if in every question one answer has been picked, if yes, submit button will be abled to click. The isAllAnswered will be updated, everytime anything changes in the answers state. 
  useEffect(() => {
    const allAnswered = answers.every(answer =>{
      return answer.some(item => {
        return item.isHeld
      })
    })

      setIsAllAnswered(allAnswered)
  })


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

  // const allAnswered = answers.every(answer =>{
  //   return answer.some(item => {
  //     return item.isHeld
  //   })
  // })

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
    setSubmit(!submit)
  }

  //Function to handle new game button
  function toggleNewGame(){
    setNewGame(!newGame)
    setSubmit(!submit)
  }    

 
  return (
    <div className="App">
      {
       !start ? 
          (<Landing start={toggleStart} /> ) :
       
          ( loading ?
            (<div className="loading">
              <GridLoader  color="#3498db" loading={loading} size={50} />
            </div> ) :
          
            (<Quiz answers={answers} 
                questions={questions} 
                toggle={toggleAnswer} 
                submitBtn={toggleSubmit}
                newGameBtn={toggleNewGame}
                submit={submit}
                allAnswered={isAllAnswered}
                score={score}
            />)
          )  
      }

    </div>
  );
}

export default App;