import React, { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'

function MyComponent() {
  let refApp = useRef(null);
  let wrap = useRef(null);

  const [app, setApp] = useState(null);
  const [rotationX, setRotationX] = useState(5);


  let rotationSpeed = {rotationX:5,rotationY:0};
  let width = 640
  let height = 786;

  // Add all the containers
  var stage = new PIXI.Container();
  var image = new PIXI.Container();
  var container = new PIXI.Container();
  var foreground = new PIXI.Container();
  var foreground2 = new PIXI.Container();
  var background = new PIXI.Container();
  var shaderLayer = new PIXI.Container();

  var displacementFilter, displacementFilter2, displacementFilter3;
  var foregroundTexure, maskOverlapTexture , backgroundTexture;
  var displacement, displacement2, displacement3;
  var card;
  var mask;
  var displacementBlur, displacementBlur2;
  var mousex = width, mousey = height;
  var ploader = new PIXI.Loader();

  var count = 0;

  useEffect(() => {
    console.log(" rotationX", rotationX)

    let movementX = rotationX*6;
    let movementY = rotationSpeed.rotationY*0.5;

    if(displacementFilter != null){ //Check if null, because it needed to be loaded first
      displacementFilter.scale.x = -movementX;
      displacementFilter3.scale.x = -movementX;
      displacementFilter2.scale.x = -movementX;
    }
    background.x = -movementX/2 - 50;
    foreground.x = -movementX/2;
    foreground2.x = -movementX/2;

    console.log(" background.x", background.x)
    console.log(" app", app)
    console.log(" stage", stage)


    if(!app) return;
    app.renderer.render(stage);  

    return () => {
      
    };
  }, [rotationX]);

  useEffect(() => {

    if(refApp.current == null || app == null) return;

    console.log('app', app)
    console.log('app renderer', app.renderer)

      
    refApp.current.appendChild(app.renderer.view);

    return () => {
      
    };
  }, [refApp.current, app]);

  useEffect(() => {
    if(!app) return;

    // Start the PixiJS app
    app.start();

    addContainers();
    loadTextures();

    PIXI.Ticker.shared.add((time) =>  animate());

    return () => {
      
    };
  }, [app]);


  useEffect(() => {
    // On first render load our application
    loadPixi();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  function loadPixi(){
    gsap.to(rotationSpeed,{rotationX:-rotationSpeed.rotationX,duration:3,repeat: -1,yoyo: true,ease:Quad.easeInOut,onUpdate:function(){
      gsap.set("#wrap",{rotationY:rotationSpeed.rotationX,rotationX:rotationSpeed.rotationY});
      setRotationX(-rotationSpeed.rotationX);
    }});

    setupApp();
  }

  function setupApp(){
    let tempApp = new PIXI.Application({
      width: width,
      height: height,
      antialias: false, // default: false
      backgroundAlpha: false, // default: false
      resolution: 1, // default: 1
      autoStart: false,
    })

    tempApp.renderer.resize(window.innerWidth, window.innerHeight);
    tempApp.renderer.view.style.position = 'relative';

    setApp(tempApp);
  }

  function addContainers(){
    stage.addChild(container);
    container.addChild(image);
    image.addChild(background);
    image.addChild(foreground);
    container.addChild(foreground2);
  }

  function loadTextures(){
    ploader.add('fg', '/assets/images/mickey_trans.png');
    ploader.add('fg_top', '/assets/images/mickey_trans_spoon.png');
    ploader.add('depth', '/assets/images/mickey_depth12.png');
    ploader.add('bg', '/assets/images/mickey_bg.png');
    ploader.add('bg_depth', '/assets/images/mickey_bg_depth.png');
    ploader.add('card', '/assets/images/card.png');
    ploader.add('mask', '/assets/images/mask.png');
    
    ploader.onComplete.add(() => {
      setTextures();
      setDisplacement();
    });
    ploader.load();
  }

  function setTextures(){

    console.log(" set texture");
    
    foregroundTexure = new PIXI.Sprite(ploader.resources.fg.texture);
    maskOverlapTexture = new PIXI.Sprite(ploader.resources.fg_top.texture);

    backgroundTexture = new PIXI.Sprite(ploader.resources.bg.texture);
    background.addChild(backgroundTexture);
    foreground.addChild(foregroundTexure);
    card = new PIXI.Sprite(ploader.resources.card.texture);
    mask = new PIXI.Sprite(ploader.resources.mask.texture);
    container.addChild(card);
    container.addChild(mask);
    container.addChild(foreground2);
    foreground2.addChild(maskOverlapTexture);
    
    card.scale.set(0.65)
    mask.scale.set(0.65)

    image.mask = mask;
  }

  function setDisplacement(){
    displacement = new PIXI.Sprite(ploader.resources.depth.texture);
      foreground.addChild(displacement);
      displacementFilter = new PIXI.filters.DisplacementFilter(displacement, 0);
    foregroundTexure.filters = [displacementFilter];

    displacement2 = new PIXI.Sprite(ploader.resources.bg_depth.texture);
    displacementFilter2 = new PIXI.filters.DisplacementFilter(displacement2, 0);
    background.addChild(displacement2);
    backgroundTexture.filters = [displacementFilter2];
    foreground.x = foreground2.x =  -15;

    displacement3 = new PIXI.Sprite(ploader.resources.depth.texture);
    foreground2.addChild(displacement3);
    displacementFilter3 = new PIXI.filters.DisplacementFilter(displacement3, 0);
    maskOverlapTexture.filters = [displacementFilter3];
  }

  function animate() {
    if(!app) return;

    console.log("animate")

  }

  return <div id="wrap" ref={wrap}><div ref={refApp}/></div>;
}

export default MyComponent;

