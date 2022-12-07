import React, { useRef, useEffect, useState } from "react";
import * as Pixi from "pixi.js";

const LOCAL_STORAGE_KEY = "pixi_react_app";

function MyComponent() {
  const ref = useRef(null);

  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  useEffect(() => {
    // On first render create our application

    const app = new Pixi.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x5bba6f,
    });

    // Add app to DOM
    ref.current.appendChild(app.view);
    // Start the PixiJS app
    app.start();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  useEffect(() => {
    const storedCount = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if(storedCount) setCount(storedCount);
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(count));
  }, [count])
  

  return(<>
    <div ref={ref} />;
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
         Click me
      </button>
    </div>
  </>) 
}

export default MyComponent;
