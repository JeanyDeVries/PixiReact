import React, { useRef, useEffect, useState } from "react";
import * as Pixi from "pixi.js";
import ContainerSprites from "./ContainerSprites";

function MyComponent() {
  const ref = useRef(null);
  const application = useRef(null);

  useEffect(() => {
    // On first render create our application
    const app = new Pixi.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x5bba6f,
    });

    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.renderer.view.style.position = 'relative';

    // Add app to DOM
    ref.current.appendChild(app.view);
    application.current.appendChild(app);

    // Start the PixiJS app
    app.start();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  return(<>
    <div ref={ref} />
    <ContainerSprites app={application}/>
  </>) 
}

export default MyComponent;
