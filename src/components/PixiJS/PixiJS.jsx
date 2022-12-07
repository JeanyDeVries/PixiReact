import React, { useRef, useEffect } from "react";
import * as Pixi from "pixi.js";

function MyComponent() {
  const ref = useRef(null);

  console.log("testing");

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

  return <div ref={ref} />;
}

export default MyComponent;
