import PixiJS from "./components/PixiJS";
import React from "react";

function App() {
  return (<>
    <div className="App">
      <PixiJS 
        jsonName = "01-Mickey-2048x"
        colorCardBar = '0x5EA13A'
        title = "Mickey Mouse"
        subtitle = "#Aventureux"
        fontTitle = "Arial"
        fontSubtitle = "Arial"
      />
    </div>
  </>);
}

export default App;
