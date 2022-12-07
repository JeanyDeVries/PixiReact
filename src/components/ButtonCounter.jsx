import React, { useRef, useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "pixi_react_app";

export default function ButtonCounter() {
      // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  useEffect(() => {
    const storedCount = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if(storedCount) setCount(storedCount);
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(count));
  }, [count])

  return(<>
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
         Click me
      </button>
    </div>
  </>) 
}
