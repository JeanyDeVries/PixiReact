import React, { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'

let rotationSpeed = {rotationX:5,rotationY:0};
let app = null;
let spritesheet;
let scale = 0.65;

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
let icons;
let frontTexture;
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
    ploader.add('depth', '/assets/images/mickey_depth12.png');
    ploader.add('bg_depth', '/assets/images/mickey_bg_depth.png');    

    ploader.add('mask', '/assets/images/mask.png');
    var sheet = ploader.add('mickey', '/assets/spritesheets/01-Mickey-1024x.json');    
    
    ploader.onComplete.add(() => {
      setTextures();
      setDisplacement();
    });
    ploader.load();
  }

  function setTextures(){    
    spritesheet = ploader.resources.mickey.spritesheet;
    
    //Set this in a function and loop through this
    foregroundTexure = new PIXI.Sprite(spritesheet.textures['05-Back.png']);
    foregroundTexure.width = spritesheet._frames['05-Back.png'].spriteSourceSize.w;
    foregroundTexure.height = spritesheet._frames['05-Back.png'].spriteSourceSize.h;
    foregroundTexure.x = -spritesheet._frames['05-Back.png'].spriteSourceSize.x;
    foregroundTexure.y = spritesheet._frames['05-Back.png'].spriteSourceSize.y;
    foregroundTexure.scale.set(scale)

    maskOverlapTexture = new PIXI.Sprite(spritesheet.textures['02-Front.png']);
    maskOverlapTexture.width = spritesheet._frames['02-Front.png'].sourceSize.w;
    maskOverlapTexture.height = spritesheet._frames['02-Front.png'].sourceSize.h;
    maskOverlapTexture.x = -spritesheet._frames['05-Back.png'].spriteSourceSize.x;
    maskOverlapTexture.y = spritesheet._frames['05-Back.png'].spriteSourceSize.y;
    maskOverlapTexture.scale.set(scale)

    backgroundTexture = new PIXI.Sprite(spritesheet.textures['07-Background.png']);
    backgroundTexture.width = spritesheet._frames['07-Background.png'].sourceSize.w;
    backgroundTexture.height = spritesheet._frames['07-Background.png'].sourceSize.h;
    backgroundTexture.scale.set(scale)

    icons = new PIXI.Sprite(spritesheet.textures['01-Icons.png']);
    icons.width = spritesheet._frames['01-Icons.png'].sourceSize.w;
    icons.height = spritesheet._frames['01-Icons.png'].sourceSize.h;
    icons.scale.set(scale)

    frontTexture = new PIXI.Sprite(spritesheet.textures['04-Bar.png']);
    frontTexture.width = spritesheet._frames['04-Bar.png'].sourceSize.w;
    frontTexture.height = spritesheet._frames['04-Bar.png'].sourceSize.h;
    frontTexture.scale.set(scale)

    card = new PIXI.Sprite(spritesheet.textures['03-Frame.png']);
    card.width = spritesheet._frames['03-Frame.png'].sourceSize.w;
    card.height = spritesheet._frames['03-Frame.png'].sourceSize.h;

    mask = new PIXI.Sprite(ploader.resources.mask.texture);
    //mask = new PIXI.Sprite(spritesheet.textures['05-Back-depth.png']);
    //mask.width = spritesheet._frames['05-Back-depth.png'].sourceSize.w;
    //mask.height = spritesheet._frames['05-Back-depth.png'].sourceSize.h;

    //Make a sprite loose from json file, copy bitmap?
    let displacementSprite = new PIXI.Sprite(spritesheet.textures['05-Back-depth.png']);
    displacementSprite.width = spritesheet._frames['05-Back-depth.png'].sourceSize.w;
    displacementSprite.height = spritesheet._frames['05-Back-depth.png'].sourceSize.h;
    displacementSprite.scale.set(scale)
    let displacementTex = displacementSprite.texture;
    displacement = new PIXI.Sprite(displacementTex);

    let backgroundDisplacementSprite = new PIXI.Sprite(spritesheet.textures['07-Background-depth.png']);
    backgroundDisplacementSprite.width = spritesheet._frames['07-Background-depth.png'].sourceSize.w;
    backgroundDisplacementSprite.height = spritesheet._frames['07-Background-depth.png'].sourceSize.h;
    backgroundDisplacementSprite.scale.set(scale)
    let backgroundDisplacementTex = backgroundDisplacementSprite.texture;
    backgroundDisplacement = new PIXI.Sprite(backgroundDisplacementTex);


    let overlayDisplacementSprite = new PIXI.Sprite(spritesheet.textures['05-Back-depth.png']);
    overlayDisplacementSprite.width = spritesheet._frames['05-Back-depth.png'].sourceSize.w;
    overlayDisplacementSprite.height = spritesheet._frames['05-Back-depth.png'].sourceSize.h;
    overlayDisplacementSprite.scale.set(scale)
    let overlayDisplacementTex = overlayDisplacementSprite.texture;
    overlayDisplacement = new PIXI.Sprite(overlayDisplacementTex);

    //foreground2.addChild(overlayDisplacement);

    
    //displacement = new PIXI.Sprite(ploader.resources.depth.texture);
    //backgroundDisplacement = new PIXI.Sprite(ploader.resources.bg_depth.texture);
    //overlayDisplacement = new PIXI.Sprite(ploader.resources.depth.texture);
    
    background.addChild(backgroundTexture);
    foreground.addChild(foregroundTexure);
    container.addChild(icons);
    container.addChild(frontTexture);
    container.addChild(card);
    container.addChild(mask);
    container.addChild(foreground2);
    foreground2.addChild(maskOverlapTexture);

    card.scale.set(scale)
    mask.scale.set(scale)

    image.mask = mask;
  }

  function setDisplacement(){
    console.log(displacement)
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