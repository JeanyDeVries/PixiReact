import PixiJS from "./components/PixiJS";
import React from "react";

function App() {
  return (<>
    <div className="App">
      <PixiJS 
        jsonName = "01-Mickey-2048x"
        colorCardBar = '0x5EA13A'
        colorCardNumber = '0x5EA13A'
        title = "Mickey Mouse"
        subtitle = "#Aventureux"
        cardNumber = "01"
        cardLetter = "A"
        health = "08"
        social = "10"
        energy = "06"
        rotationDisplacement = '5' //max 8 ish
        displacementBackgroundOffset = '50' //max 70 ish
      />
    </div>
  </>);
}

export default App;
