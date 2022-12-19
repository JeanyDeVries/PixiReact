import PixiJS from "./components/PixiJS";
import React from "react";

function App() {
  return (<>
    <div className="App">
      <PixiJS 
        jsonName = "01-Mickey-1024x"
        colorCardBar = '0x5EA13A'
      />
    </div>
  </>);
}

export default App;
