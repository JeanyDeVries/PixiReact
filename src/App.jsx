import PixiJS from "./components/PixiJS";
import AnimationCard from "./components/AnimationCard";
import React from "react";

function App() {
  return (<>
    <div className="App">
      <PixiJS 
        spriteWhileLoading = {"mickeyCard.png"}
        jsonName = {"38-Winnie-2048x"}
        colorCardBar = {'0x5EA13A'}
        colorCardNumber = {'0x5EA13A'}
        titleTxt = {"Mickey Mouse"}
        subtitleTxt = {"#Aventureux"}
        cardNumberTxt = {"01"}
        cardLetterTxt = {"A"}
        healthTxt = {"08"}
        socialTxt = {"10"}
        energyTxt = {"06"}
        rotationDuration = {0.5}
        rotationAmountX = {5}
      />
    </div>
  </>);
}

export default App;
