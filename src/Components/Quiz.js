import React from "react";

export default function Quiz({answers, questions, toggle}){
      
      return(
      <section className="questions-container">
            <div>
                  {
                  questions.map((question, index) =>(
                  <div key={question.key} className="question-box">
                        <p>{question.value}</p>
                  
                        <div className="answers-container"> 
                              {
                              answers[index].map(answer => (
                                    <p key={answer.key} 
                                    className="answer"
                                    onClick={()=>toggle(answer.key, index)}>{answer.value}</p>
                              ))
                              }
                        </div>

                  </div>
                  ))
                  }
            </div>
      </section>
      )
}