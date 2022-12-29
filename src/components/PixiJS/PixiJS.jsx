import React, { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'
import FontFaceObserver from 'fontfaceobserver';
import PixiHelper from './pixiHelper.js';	
import dataImageExceptions from './data/imageDisplacementExceptions.json';
import AnimationCard from "../AnimationCard";


let rotationDuration = 1;
let rotationAmount = {rotationAmountX:5,rotationAmountY:0};
let app = null;
let spritesheetContent, spritesheetGeneric;
let scale = 0.65;

let stage = new PIXI.Container();
let image = new PIXI.Container();
let container = new PIXI.Container();
let foreground = new PIXI.Container();
let foreground2 = new PIXI.Container();
let background = new PIXI.Container();
let displacementContainer = new PIXI.Container();
let uiElements = new PIXI.Container();

let displacementFilter, backgroundDisplacementFilter, overlayDisplacementFilter;
let foregroundTexure, maskOverlapTexture , backgroundTexture;
let displacement, backgroundDisplacement, overlayDisplacement;
let card, icons, avatarIcon, frontTexture;
let mask;
let shadow;
let ploader = new PIXI.Loader();

let maxRotationDisplacement = 8;
let maxDisplacementBackgroundOffset = 70;
let rotationDisplacement = 3 //default 3
let displacementBackgroundOffset = 50 
let pixiHelper;

let animationRotationCard; 
let maxAnimationRotationCard = 10;

function MyComponent({spriteWhileLoading, jsonName, colorCardBar, colorCardNumber, titleTxt,
        subtitleTxt, cardNumberTxt, cardLetterTxt, healthTxt, socialTxt, energyTxt, rotationAmount, animationRotationCard}) // Set all the props in variables
{
  let refApp = useRef(null);
  let wrap = useRef(null);
  let loadingSprite = useRef(null);
  let loader = useRef(null);

  const [rotation, setRotation] = useState(5);
  const [innited, setInnited] = useState(false);
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(786);
  const [playAnim, setPlayAnim] = useState(false); 

  loadingSprite = './assets/images/' + spriteWhileLoading; // Load the sprite that shows before pixi is loaded

  useEffect(() => {
    let rotationX = rotationAmount.rotationAmountX;
    let movementX = rotationX*rotationDisplacement;

    if(displacementFilter != null){ //Check if null, because it needs to be loaded first
      displacementFilter.scale.x = -movementX;
      overlayDisplacementFilter.scale.x = -movementX;
      backgroundDisplacementFilter.scale.x = -movementX;
    }
    background.x = -movementX/2 - displacementBackgroundOffset;
    foreground.x = -movementX/2;
    foreground2.x = -movementX/2;
    return () => {
      
    };
  }, [rotation]);

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
      console.log("destroy app")
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  function loadPixi(){
    console.log(animationRotationCard)

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
    pixiHelper = new PixiHelper(app);

    if(rotationDisplacement > maxRotationDisplacement) // Set maximum rotation displacement
      rotationDisplacement = maxRotationDisplacement;
    else rotationDisplacement = rotationDisplacement;

    if(displacementBackgroundOffset > maxDisplacementBackgroundOffset) // Set maximumd displacement background offset
      displacementBackgroundOffset = maxDisplacementBackgroundOffset;
    else displacementBackgroundOffset = displacementBackgroundOffset;

    addContainers();
    loadTextures();
    setRotationDisplacement();

    PIXI.Ticker.shared.add((time) =>  animate());
  }

  function setRotationDisplacement(){
    const data = dataImageExceptions.map( (data)=>{
      let nameSprite = jsonName.split('-')[1]; //Get the name of the character of the card
      let cardName = data.name;

      if(nameSprite == cardName){
        rotationDisplacement = data.rotationDisplacement;
      }
    });
  }

  function addContainers(){
    stage.addChild(container);
    container.addChild(image);
    image.addChild(background);
    image.addChild(foreground);
    container.addChild(foreground2);
    container.addChild(displacementContainer);
    stage.addChild(uiElements);
  }

  function loadTextures(){
    ploader.add("contentsCard", '/assets/spritesheets/' + jsonName +'.json');    
    ploader.add("genericSheet", '/assets/spritesheets/genericCardAssets.json');    
    ploader.add('card', '/assets/images/mickeyCard.png'); 

    ploader.onComplete.add(() => {
      pixiHelper.fadeOutEffect(loader.current);
      setTextures();
      addChildren();
      setDisplacement();
      setAllTexts();
      setPlayAnim(true);
    });
    ploader.load();
  }

  function setAllTexts(){
    var semiBold = new FontFaceObserver('proxima_novasemibold');
    semiBold.load().then(function () { // Only set the text when the font is loaded
      let title = pixiHelper.setText(titleTxt, 'proxima_novasemibold', 32, 'white', 184, 670);
      let health = pixiHelper.setText(healthTxt, 'proxima_novasemibold', 26, 'white', 425, 300);
      let social = pixiHelper.setText(socialTxt, 'proxima_novasemibold', 26, 'white', 428, 412);
      let energy = pixiHelper.setText(energyTxt, 'proxima_novasemibold', 26, 'white', 425, 508);

      uiElements.addChild(title);
      uiElements.addChild(health);
      uiElements.addChild(social);
      uiElements.addChild(energy);
    });

    var bold = new FontFaceObserver('proxima_novaextrabold');
    bold.load().then(function () { // Only set the text when the font is loaded
      let cardNumber = pixiHelper.setText(cardNumberTxt, 'proxima_novaextrabold', 26, colorCardNumber, 422, 57);
      let cardLetter = pixiHelper.setText(cardLetterTxt, 'proxima_novaextrabold', 18, colorCardNumber, 449, 65);

      uiElements.addChild(cardNumber); 
      uiElements.addChild(cardLetter); 
    });

    var regular = new FontFaceObserver('proxima_novaregular');
    regular.load().then(function () { // Only set the text when the font is loaded
      let subtitle = pixiHelper.setText(subtitleTxt, 'proxima_novaregular', 22.5, 'white', 184, 707);

      uiElements.addChild(subtitle); 
    });
  }

  function setTextures(){    
    spritesheetContent = ploader.resources.contentsCard.spritesheet;
    spritesheetGeneric = ploader.resources.genericSheet.spritesheet;

    card = pixiHelper.setSprite('04-Frame.png', 0,0, scale, spritesheetGeneric);
    mask = pixiHelper.setSprite('BG.png', 0, 0, scale, spritesheetGeneric)
    frontTexture = pixiHelper.setSprite('05-Bar.png', 0, 0, scale, spritesheetGeneric)    
    shadow = pixiHelper.setSprite('07-Shadow.png', displacementBackgroundOffset, 0, scale, spritesheetGeneric)
    icons = pixiHelper.setSprite('01-Icons.png', 0, 0, scale, spritesheetGeneric)
    
    frontTexture.tint = colorCardBar;

    foregroundTexure = pixiHelper.setSprite('06-Back.png', -20, 0, scale, spritesheetContent);
    avatarIcon = pixiHelper.setSprite('02-Avatar.png', 0, 0, scale, spritesheetContent);
    maskOverlapTexture = pixiHelper.setSprite('03-Front.png', -20, 0, scale, spritesheetContent);
    backgroundTexture = pixiHelper.setSprite('08-Background.png', 0, 0, scale, spritesheetContent)

    displacement = pixiHelper.setDisplacementSprite(scale, '06-Back-depth.png', -20, 0, spritesheetContent);
    overlayDisplacement = pixiHelper.setDisplacementSprite(scale, '06-Back-depth.png', -20, 0, spritesheetContent);
    backgroundDisplacement = pixiHelper.setDisplacementSprite(scale, '08-Background-depth.png', 0, 0, spritesheetContent);

    // Set a mask that will be used to hide elements outside the card
    image.mask = mask;
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
      if(maskOverlapTexture)
        maskOverlapTexture.filters = [overlayDisplacementFilter];
    }
  }

  function addChildren(){
    if(backgroundTexture)background.addChild(backgroundTexture);
    if(foregroundTexure)foreground.addChild(foregroundTexure);
    if(icons)uiElements.addChild(icons);
    if(frontTexture)container.addChild(frontTexture);
    if(card)container.addChild(card);
    if(shadow)background.addChild(shadow);
    if(mask)container.addChild(mask);
    if(foreground2)container.addChild(foreground2);
    if(maskOverlapTexture)foreground2.addChild(maskOverlapTexture);
    if(displacement)foreground2.addChild(displacement);
    if(backgroundDisplacement)foreground2.addChild(backgroundDisplacement);
    if(overlayDisplacement)foreground2.addChild(overlayDisplacement);
    if(avatarIcon)uiElements.addChild(avatarIcon);
  }


  function animate() {
    if(!app) return;   

    // Render the app each frame for the animation and displacement
    app.renderer.render(stage); 
    setRotation(rotationAmount.rotationAmountX);
  }

  return <div ref={wrap} style={{perspective:'1000px',transformOrigin:'50% 50%',width:width,height:height}}>
        <div ref={refApp} style={{position:'absolute'}}> 
            {/* <AnimationCard 
              htmlElement={refApp}
              setRotationX={setRotationX}
              rotationAmountX={rotationAmountX}
              playAnim={playAnim}
            /> */}
            {/* <div ref = {bar}/> */}

          <img ref={loader} src={loadingSprite} style={{position:'absolute', width: width * 0.8, height: height}}/>
        </div>

    </div>
}

export default MyComponent;