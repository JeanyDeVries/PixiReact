import React, { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'

function MyComponent() {
  const ref = useRef(null);

  useEffect(() => {
    // On first render create our application
    let vars = {rotationX:5,rotationY:0};

    let width = 640
    let height = 786;
    gsap.to(vars,{rotationX:-vars.rotationX,duration:3,repeat: -1,yoyo: true,ease:Quad.easeInOut,onUpdate:function(){
      gsap.set("#wrap",{rotationY:vars.rotationX,rotationX:vars.rotationY});
    }});

   let app = new PIXI.Application({
      width: width,
      height: height,
      antialias: false, // default: false
      transparent: false, // default: false
      resolution: 1, // default: 1
      autoStart: false,
    })

    app.renderer.resize(window.innerWidth, window.innerHeight);
    app.renderer.view.style.position = 'relative';
  
    var cOutput = document.getElementById('wrap');
    cOutput.appendChild(app.renderer.view);

    // Add all the containers
    var stage = new PIXI.Container();
    var image = new PIXI.Container();
    var container = new PIXI.Container();
    var foreground = new PIXI.Container();
    var foreground2 = new PIXI.Container();
    var background = new PIXI.Container();
    var shaderLayer = new PIXI.Container();

    stage.addChild(container);
    container.addChild(image);
    image.addChild(background);
    image.addChild(foreground);
    container.addChild(foreground2);

    var f;
    var fg;
    var topg;
    var f3;
    var d3;
    var f2;
    var bg;
    var card;
    var mask;
    var displacementBlur;
    var displacementBlur2;
    var mousex = width, mousey = height;
    var ploader = new PIXI.loaders.Loader();

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
