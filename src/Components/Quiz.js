import React from "react";

export default function Quiz({answers, questions}){
      
      return(
      <section className="questions-container">
            <div>
                  {
                  questions.map((question, index) =>(
                  <div key={index} className="question-box">
                        <p>{question}</p>
                  
                        <div className="answers-container"> 
                              {
                              answers[index].map(answer => (
                                    <p>{answer}</p>
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