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

    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.renderer.view.style.position = 'relative';

    const container = new Pixi.Container();

    // Add app to DOM
    ref.current.appendChild(app.view);

    app.stage.addChild(container);

    // Create a new texture
    const texture = Pixi.Texture.from('/assets/images/cat.png');
    
    // Create a 5x5 grid of bunnies
    for (let i = 0; i < 25; i++) {
        const bunny = new Pixi.Sprite(texture);
        bunny.anchor.set(0.5);
        bunny.x = (i % 5) * 40;
        bunny.y = Math.floor(i / 5) * 40;
        bunny.scale.x = 0.05;
        bunny.scale.y = 0.05;
        container.addChild(bunny);
    }
    
    // Move container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    
    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    
    // Listen for animate update
    app.ticker.add((delta) => {
        // rotate the container!
        // use delta to create frame-independent transform
        container.rotation -= 0.01 * delta;
    });

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
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
         Click me
      </button>
    </div>
    <div ref={ref} />;
  </>) 
}

export default MyComponent;
