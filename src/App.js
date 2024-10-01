import './App.css';
import React from 'react';
import Landing from './Components/Landing';
import Questions from './Components/Questions';
import {useState, useEffect} from 'react'

function App() {

  const [start, setStart] = useState(false)

  const toggleStart = () => {
    setStart(prevStart => !prevStart)
  }
  
  console.log(start)

  return (
    <div className="App">
      {!start 
       ? <Landing start={toggleStart} /> 
       :  <Questions />}
    </div>
  );
}

export default App;
