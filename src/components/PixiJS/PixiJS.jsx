import React, { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'
import FontFaceObserver from 'fontfaceobserver';

let rotationSpeed = {rotationX:5,rotationY:0};
let app = null;
let spritesheetContent;
let spritesheetGeneric;
let scale = 0.8;
let outerCardScale = 0.65;

let stage = new PIXI.Container();
let image = new PIXI.Container();
let container = new PIXI.Container();
let foreground = new PIXI.Container();
let foreground2 = new PIXI.Container();
let background = new PIXI.Container();
let displacementContainer = new PIXI.Container();
let foregroundBar = new PIXI.Container();

let displacementFilter, backgroundDisplacementFilter, overlayDisplacementFilter;
let foregroundTexure, maskOverlapTexture , backgroundTexture;
let displacement, backgroundDisplacement, overlayDisplacement;
let card;
let icons;
let frontTexture;
let mask;
let avatarIcon;
let shadow;
let ploader = new PIXI.Loader();

function MyComponent(props) {
  let refApp = useRef(null);
  let wrap = useRef(null);
  let loadingSprite = useRef(null);
  let loader = useRef(null);

  const [rotationX, setRotationX] = useState(5);
  const [innited, setInnited] = useState(false);
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(786);

  loadingSprite = './assets/images/mask.png';

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
      antialias: false, // default: false
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
    stage.addChild(foregroundBar);
  }

  function loadTextures(){
    ploader.add("contentsCard", '/assets/spritesheets/' + props.jsonName +'.json');    
    ploader.add("genericSheet", '/assets/spritesheets/genericCardAssets.json');    

    ploader.onComplete.add(() => {
      fadeOutEffect(loader.current);
      setTextures();
      addChildren();
      setDisplacement();
      setText();
    });
    ploader.load();
  }

  function setText(){
    console.log(frontTexture)

    var semiBold = new FontFaceObserver('proxima_novasemibold');
    semiBold.load().then(function () {
      console.log('Font is available');
      let title = new PIXI.Text(
        props.title,
        {
          fontFamily: 'proxima_novasemibold', 
          fontSize: 32, 
          fill: 'white'
        }
      );    
      let health = new PIXI.Text(
        props.health,
        {
          fontFamily: 'proxima_novasemibold', 
          fontSize: 32, 
          fill: 'black'
        }
      );
      let social = new PIXI.Text(
        props.social,
        {
          fontFamily: 'proxima_novasemibold', 
          fontSize: 32, 
          fill: 'black'
        }
      );      
      let energy = new PIXI.Text(
        props.energy,
        {
          fontFamily: 'proxima_novasemibold', 
          fontSize: 32, 
          fill: 'black'
        }
      );
      container.addChild(title);
      container.addChild(health);
      container.addChild(social);
      container.addChild(energy);
      
    }, function () {
      console.log('Font is not available');
    });

  }

  function setTextures(){    
    spritesheetContent = ploader.resources.contentsCard.spritesheet;
    spritesheetGeneric = ploader.resources.genericSheet.spritesheet;

    card = setSprite('04-Frame.png', 0,0, outerCardScale, spritesheetGeneric);
    mask = setSprite('BG.png', 0, 0, outerCardScale, spritesheetGeneric)
    frontTexture = setSprite('05-Bar.png', 0, 0, outerCardScale, spritesheetGeneric)    
    shadow = setSprite('07-Shadow.png', 0, 0, outerCardScale, spritesheetGeneric)
    icons = setSprite('01-Icons.png', 0, 0, outerCardScale, spritesheetGeneric)
    
    frontTexture.tint = props.colorCardBar;

    foregroundTexure = setSprite('06-Back.png', -50, 0, scale, spritesheetContent);
    avatarIcon = setSprite('02-Avatar.png', 0, 0, outerCardScale, spritesheetContent);
    maskOverlapTexture = setSprite('03-Front.png', -50, 0, scale, spritesheetContent);
    backgroundTexture = setSprite('08-Background.png', 0, 0, scale, spritesheetContent)

    displacement = setDisplacementSprite('06-Back-depth.png', -50, 0, spritesheetContent);
    overlayDisplacement = setDisplacementSprite('06-Back-depth.png', -50, 0, spritesheetContent);
    backgroundDisplacement = setDisplacementSprite('08-Background-depth.png', 0, 0, spritesheetContent);

    image.mask = mask;
  }

  function addChildren(){
    if(backgroundTexture)background.addChild(backgroundTexture);
    if(foregroundTexure)foreground.addChild(foregroundTexure);
    if(icons)container.addChild(icons);
    if(frontTexture)container.addChild(frontTexture);
    if(card)container.addChild(card);
    if(shadow)container.addChild(shadow);
    if(mask)container.addChild(mask);
    if(foreground2)container.addChild(foreground2);
    if(maskOverlapTexture)foreground2.addChild(maskOverlapTexture);
    if(displacement)foreground2.addChild(displacement);
    if(backgroundDisplacement)foreground2.addChild(backgroundDisplacement);
    if(overlayDisplacement)foreground2.addChild(overlayDisplacement);
    if(avatarIcon)foregroundBar.addChild(avatarIcon);
  }

  function setSprite(spriteName, xPos, yPos, scale, spritesheet){
    let sprite = new PIXI.Sprite(spritesheet.textures[spriteName]);

    if(!spritesheet._frames[spriteName]) return null; //Set null if the frame texture does net exist

    sprite.width = spritesheet._frames[spriteName].frame.w;
    sprite.height = spritesheet._frames[spriteName].frame.h;
    sprite.x = xPos;
    sprite.y = yPos;
    sprite.scale.set(scale)
    return sprite;
  }
  
  function setDisplacementSprite(spriteName, xPos, yPos, spritesheet){
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

  function fadeOutEffect(fadeTarget) {
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.01;
        } else {
            clearInterval(fadeEffect);
        }
    }, 10);
}

  return <div ref={wrap} style={{perspective:'1000px',transformOrigin:'50% 50%',width:width,height:height}}>
        <img ref={loader} src={loadingSprite} style={{position:'absolute', width: width, height: height}}/>
        <div ref={refApp}> 

        </div>
    </div>;
}

export default MyComponent;