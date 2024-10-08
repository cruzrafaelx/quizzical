import React from "react";

export default function Quiz({answers, 
                              questions, 
                              toggle, 
                              submit, 
                              newGameBtn, 
                              submitBtn,
                              allAnswered}){
      
      return(
      <section className="questions-container">
            <div>
                  {
                  questions.map((question, index) =>(
                  <div key={question.key} className="question-box">
                        <p>{question.value}</p>
                  
                        <div className="answers-container"> 
                              {
                              answers[index] && answers[index].map(answer => (
                                    <p key={answer.key} 
                                    className={`answer 
                                                ${answer.isHeld ? "isHeld": ""}
                                                ${answer.wasNotChosen ? "not-chosen" : ""}`.trim()} 
                                    onClick={()=>toggle(answer.key, index)}>{answer.value}</p>
                              ))
                              }
                        </div>

                  </div>
                  ))
                  }
                  {
                        !submit ?
                        <button onClick={()=>submitBtn()}
                                disabled={!allAnswered}>Submit</button> :
                        <button onClick={()=>newGameBtn()}>New game</button>
                  }
            </div>
      </section>
      )
}