import React, { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'

let rotationSpeed = {rotationX:5,rotationY:0};
let app = null;
let spritesheet;
let spritesheetName; 
let scale = 0.8;
let outerCardScale = 0.65;

let stage = new PIXI.Container();
let image = new PIXI.Container();
let container = new PIXI.Container();
let foreground = new PIXI.Container();
let foreground2 = new PIXI.Container();
let background = new PIXI.Container();
let displacementContainer = new PIXI.Container();

let displacementFilter, backgroundDisplacementFilter, overlayDisplacementFilter;
let foregroundTexure, maskOverlapTexture , backgroundTexture;
let displacement, backgroundDisplacement, overlayDisplacement;
let card;
let icons;
let frontTexture;
let mask;
let ploader = new PIXI.Loader();

function MyComponent(props) {
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
    container.addChild(displacementContainer);
  }

  function loadTextures(){
    ploader.add('mask', '/assets/images/mask.png'); //Mask is not in the json yet, now locally adding it
    var sheet = ploader.add("contentsCard", '/assets/spritesheets/' + props.jsonName +'.json');    
    
    ploader.onComplete.add(() => {
      setTextures();
      addChildren();
      setDisplacement();
    });
    ploader.load();
  }

  function setTextures(){    
    spritesheet = ploader.resources.contentsCard.spritesheet;

    card = setSprite('03-Frame.png', 0,0, outerCardScale);
    foregroundTexure = setSprite('05-Back.png', -50, 0, scale);
    maskOverlapTexture = setSprite('02-Front.png', -50, 0, scale);
    backgroundTexture = setSprite('07-Background.png', 0, 0, scale)
    icons = setSprite('01-Icons.png', 0, 0, outerCardScale);
    frontTexture = setSprite('04-Bar.png', 0, 0, outerCardScale)

    mask = new PIXI.Sprite(ploader.resources.mask.texture); //Add this sprite from loader, it is not in JSON yet
    mask.scale.set(outerCardScale)

    displacement = setDisplacementSprite('05-Back-depth.png', -50, 0);
    overlayDisplacement = setDisplacementSprite('05-Back-depth.png', -50, 0);
    backgroundDisplacement = setDisplacementSprite('07-Background-depth.png', 0, 0);

    image.mask = mask;
  }

  function addChildren(){
    if(backgroundTexture)background.addChild(backgroundTexture);
    if(foregroundTexure)foreground.addChild(foregroundTexure);
    if(icons)container.addChild(icons);
    if(frontTexture)container.addChild(frontTexture);
    if(card)container.addChild(card);
    if(mask)container.addChild(mask);
    if(foreground2)container.addChild(foreground2);
    if(maskOverlapTexture)foreground2.addChild(maskOverlapTexture);
    if(displacement)foreground2.addChild(displacement);
    if(backgroundDisplacement)foreground2.addChild(backgroundDisplacement);
    if(overlayDisplacement)foreground2.addChild(overlayDisplacement);
  }

  function setSprite(spriteName, xPos, yPos, scale){
    let sprite = new PIXI.Sprite(spritesheet.textures[spriteName]);

    if(!spritesheet._frames[spriteName]) return null; //Set null if the frame texture does net exist

    sprite.width = spritesheet._frames[spriteName].frame.w;
    sprite.height = spritesheet._frames[spriteName].frame.h;
    sprite.x = xPos;
    sprite.y = yPos;
    sprite.scale.set(scale)
    return sprite;
  }
  
  function setDisplacementSprite(spriteName, xPos, yPos){
    const baseTex = spritesheet.textures[spriteName];

    if(!baseTex) return null; //Set null if the frame texture does net exist

    const renderSprite = new PIXI.Sprite(baseTex);

    renderSprite.position.x = 0;
    renderSprite.position.y = 0;
    renderSprite.anchor.x = 0;
    renderSprite.anchor.y = 0;

    const renderTexture = PIXI.RenderTexture.create({
      width: baseTex.orig.width,
      height: baseTex.orig.height,
    });
    
    app.renderer.render(renderSprite, {
      renderTexture: renderTexture,
    });

    let sprite = new PIXI.Sprite(renderTexture);
    sprite.x = xPos;
    sprite.y = yPos;
    sprite.width = baseTex.orig.width;
    sprite.height = baseTex.orig.height;
    sprite.scale.set(scale)

    return sprite;
  }

  function setDisplacement(){
    if(displacement){
      foreground.addChild(displacement);
      displacementFilter = new PIXI.filters.DisplacementFilter(displacement, 0);
      foregroundTexure.filters = [displacementFilter];
      displacement.texture.updateUvs();
    }
    if(backgroundDisplacement){
      backgroundDisplacementFilter = new PIXI.filters.DisplacementFilter(backgroundDisplacement, 0);
      background.addChild(backgroundDisplacement);
      backgroundTexture.filters = [backgroundDisplacementFilter];
      foreground.x = foreground2.x =  -15;
    }
    if(overlayDisplacement){
      foreground2.addChild(overlayDisplacement);
      overlayDisplacementFilter = new PIXI.filters.DisplacementFilter(overlayDisplacement, 0);
      maskOverlapTexture.filters = [overlayDisplacementFilter];
    }
  }

  function animate() {
    if(!app) return;   

    app.renderer.render(stage); 
  }

  return <div ref={wrap} style={{perspective:'1000px',transformOrigin:'50% 50%',width:width,height:height}}><div ref={refApp}/></div>;
}

export default MyComponent;