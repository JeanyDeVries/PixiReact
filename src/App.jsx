import PixiJS from "./components/PixiJS";
import React from "react";

function App() {
  return (<>
    <div className="App">
      <PixiJS 
        jsonName = {"01-Mickey-2048x"}
        colorCardBar = {'0x5EA13A'}
        colorCardNumber = {'0x5EA13A'}
        titleTxt = {"Mickey Mouse"}
        subtitleTxt = {"#Aventureux"}
        cardNumberTxt = {"01"}
        cardLetterTxt = {"A"}
        healthTxt = {"08"}
        socialTxt = {"10"}
        energyTxt = {"06"}
        rotationDisplacement = {'5'} //max 8 ish
        displacementBackgroundOffset = {'50'} //max 70 ish
      />
    </div>
  </>);
}

export default App;
