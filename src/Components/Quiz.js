import React from "react";

export default function Quiz({answers, 
                              questions, 
                              toggle, 
                              submit, 
                              newGameBtn, 
                              submitBtn,
                              allAnswered}){
      
      return(
      <section className="questions-background">
            <div className="questions-container">
                  <div>
                        {
                        questions.map((question, index) =>(
                        <div key={question.key} className="question-box">
                              <p className="question">{question.value}</p>
                        
                              <div className="answers-container"> 
                                    {
                                    answers[index] && answers[index].map(answer => { 
                                          const correct = answer.isHeld && answer.isCorrect

                                          const wrong = answer.isHeld && !answer.isCorrect

                                          return (
                                          <p key={answer.key} 
                                          className={`answer 
                                                      ${answer.isHeld ? "isHeld": ""}
                                                      ${submit && wrong ? "wrong" : ""}
                                                      ${submit && correct ? "correct" : ""}
                                                      ${submit && answer.isCorrect ? "correct" :""}
                                                      ${submit ? "no-click" : ""}
                                                      `.trim()} 
                                          onClick={()=>toggle(answer.key, index)}>{answer.value}</p>
                                    )})
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
            </div> 
            
      </section>
      )
}