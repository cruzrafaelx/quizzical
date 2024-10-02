import React from "react";

export default function Landing({start}){

      return(

            <section className="landing-container">
                  <h1>Quizzical</h1>
                  <h3>Are you really that smart as you proclaim?</h3>
                  <button onClick={start}>Start quiz</button>
            </section>
      )
}