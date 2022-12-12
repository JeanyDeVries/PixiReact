import React, { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'

let rotationSpeed = {rotationX:5,rotationY:0};
let app = null;
let spritesheet;

let stage = new PIXI.Container();
let image = new PIXI.Container();
let container = new PIXI.Container();
let foreground = new PIXI.Container();
let foreground2 = new PIXI.Container();
let background = new PIXI.Container();

let displacementFilter, backgroundDisplacementFilter, overlayDisplacementFilter;
let foregroundTexure, maskOverlapTexture , backgroundTexture;
let displacement, backgroundDisplacement, overlayDisplacement;
let card;
let mask;
let ploader = new PIXI.Loader();

function MyComponent() {
  let refApp = useRef(null);
  let wrap = useRef(null);

  const [rotationX, setRotationX] = useState(5);
  const [innited, setInnited] = useState(false);
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(786);

  useEffect(() => {
    let movementX = rotationX*6;

    if(displacementFilter != null){ //Check if null, because it needed to be loaded first
      displacementFilter.scale.x = -movementX;
      overlayDisplacementFilter.scale.x = -movementX;
      backgroundDisplacementFilter.scale.x = -movementX;
    }
    background.x = -movementX/2 - 50;
    foreground.x = -movementX/2;
    foreground2.x = -movementX/2;
    return () => {
      
    };
  }, [rotationX]);

  useEffect(() => {
    if(refApp.current == null || app == null) return;
    refApp.current.appendChild(app.renderer.view);

    return () => {
      
    };
  }, [refApp, innited]);

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
      gsap.set(refApp.current,{rotationY:rotationSpeed.rotationX,rotationX:rotationSpeed.rotationY});
      setRotationX(-rotationSpeed.rotationX);
    }});

    setupApp();
  }

  function setupApp(){
    app = new PIXI.Application({
      width: width,
      height: height,
      antialias: true, // default: false
      backgroundAlpha: false, // default: false
      resolution: 1, // default: 1
      autoStart: false,
    })

    app.renderer.resize(width, height);
    app.renderer.view.style.position = 'relative';
    app.start();

    setInnited(true);

    addContainers();
    loadTextures();

    PIXI.Ticker.shared.add((time) =>  animate());
  }

  function addContainers(){
    stage.addChild(container);
    container.addChild(image);
    image.addChild(background);
    image.addChild(foreground);
    container.addChild(foreground2);
  }

  function loadTextures(){
    /*
    ploader.add('fg', '/assets/images/mickey_trans.png');
    ploader.add('fg_top', '/assets/images/mickey_trans_spoon.png');
    ploader.add('depth', '/assets/images/mickey_depth12.png');
    ploader.add('bg', '/assets/images/mickey_bg.png');
    ploader.add('bg_depth', '/assets/images/mickey_bg_depth.png');
    ploader.add('card', '/assets/images/card.png');
    ploader.add('mask', '/assets/images/mask.png');
    */

    ploader.add('mickey', '/assets/spritesheets/01-Mickey.json');    
    
    ploader.onComplete.add(() => {
      setTextures();
      setDisplacement();
      
    });
    ploader.load();
  }

  function setTextures(){    
    /*
    foregroundTexure = new PIXI.Sprite(ploader.resources.fg.texture);
    maskOverlapTexture = new PIXI.Sprite(ploader.resources.fg_top.texture);
    backgroundTexture = new PIXI.Sprite(ploader.resources.bg.texture);
    card = new PIXI.Sprite(ploader.resources.card.texture);
    mask = new PIXI.Sprite(ploader.resources.mask.texture);
    */
    spritesheet = ploader.resources.mickey.spritesheet;

    foregroundTexure = new PIXI.Sprite(spritesheet.textures['05-Back.png']);
    foregroundTexure.width = spritesheet._frames['05-Back.png'].sourceSize.w;
    foregroundTexure.height = spritesheet._frames['05-Back.png'].sourceSize.h;

    maskOverlapTexture = new PIXI.Sprite(spritesheet.textures['02-Front.png']);
    maskOverlapTexture.width = spritesheet._frames['02-Front.png'].sourceSize.w;
    maskOverlapTexture.height = spritesheet._frames['02-Front.png'].sourceSize.h;

    backgroundTexture = new PIXI.Sprite(spritesheet.textures['07-Background.png']);
    backgroundTexture.width = spritesheet._frames['07-Background.png'].sourceSize.w;
    backgroundTexture.height = spritesheet._frames['07-Background.png'].sourceSize.h;

    card = new PIXI.Sprite(spritesheet.textures['03-Frame.png']);
    card.width = spritesheet._frames['03-Frame.png'].sourceSize.w;
    card.height = spritesheet._frames['03-Frame.png'].sourceSize.h;

    mask = new PIXI.Sprite(spritesheet.textures['05-Back-depth.png']);
    mask.width = spritesheet._frames['05-Back-depth.png'].sourceSize.w;
    mask.height = spritesheet._frames['05-Back-depth.png'].sourceSize.h;

    displacement = new PIXI.Sprite(spritesheet.textures['05-Back-depth.png']);
    displacement.width = spritesheet._frames['05-Back-depth.png'].sourceSize.w;
    displacement.height = spritesheet._frames['05-Back-depth.png'].sourceSize.h;

    backgroundDisplacement = new PIXI.Sprite(spritesheet.textures['07-Background-depth.png']);
    backgroundDisplacement.width = spritesheet._frames['07-Background-depth.png'].sourceSize.w;
    backgroundDisplacement.height = spritesheet._frames['07-Background-depth.png'].sourceSize.h;

    overlayDisplacement = new PIXI.Sprite(spritesheet.textures['05-Back-depth.png']);
    overlayDisplacement.width = spritesheet._frames['05-Back-depth.png'].sourceSize.w;
    overlayDisplacement.height = spritesheet._frames['05-Back-depth.png'].sourceSize.h;

    background.addChild(backgroundTexture);
    foreground.addChild(foregroundTexure);
    container.addChild(card);
    container.addChild(mask);
    container.addChild(foreground2);
    foreground2.addChild(maskOverlapTexture);
    
    //card.scale.set(0.65)
    //mask.scale.set(0.65)

    image.mask = mask;
  }

  function setDisplacement(){
    foreground.addChild(displacement);
    displacementFilter = new PIXI.filters.DisplacementFilter(displacement, 0);
    foregroundTexure.filters = [displacementFilter];

    backgroundDisplacementFilter = new PIXI.filters.DisplacementFilter(backgroundDisplacement, 0);
    background.addChild(backgroundDisplacement);
    backgroundTexture.filters = [backgroundDisplacementFilter];
    foreground.x = foreground2.x =  -15;

    foreground2.addChild(overlayDisplacement);
    overlayDisplacementFilter = new PIXI.filters.DisplacementFilter(overlayDisplacement, 0);
    maskOverlapTexture.filters = [overlayDisplacementFilter];
  }

  function animate() {
    if(!app) return;   

    app.renderer.render(stage); 
  }

  return <div ref={wrap} style={{perspective:'1000px',transformOrigin:'50% 50%',width:width,height:height}}><div ref={refApp}/></div>;
}

export default MyComponent;