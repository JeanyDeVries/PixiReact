import React, { useRef, useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import gsap, {Quad} from 'gsap'
import FontFaceObserver from 'fontfaceobserver';
import PixiHelper from './pixiHelper.js';	
import dataImageExceptions from './data/imageDisplacementExceptions.json';
import AnimationCard from "../AnimationCard";


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

let displacementBackgroundOffset = 50;
let pixiHelper;

let animationRotationCard; 
let maxAnimationRotationCard = 10;
let rotationDisplacement = 3 //default 3

function MyComponent({spriteWhileLoading, jsonName, colorCardBar, colorCardNumber, titleTxt,
        subtitleTxt, cardNumberTxt, cardLetterTxt, healthTxt, socialTxt, energyTxt, rotationAmountCard, maxRotationX}) // Set all the props in variables
{
  let wrap = useRef(null);
  let loadingSprite = useRef(null);
  let loader = useRef(null);

  const [innited, setInnited] = useState(false);
  const [width, setWidth] = useState(512); //make it fit with the card, otherwise width it not correct
  const [height, setHeight] = useState(786);
  const [playAnim, setPlayAnim] = useState(false); 

  const [rotationCard, setRotationCard] = useState(maxRotationX);
  const [displacementCard, setDisplacementCard] = useState(3); //Default 3
  const [refApp, setRefApp] = useState(null);

  loadingSprite = './assets/images/' + spriteWhileLoading; // Load the sprite that shows before pixi is loaded
  
  //Set the displacement for the card
  useEffect(() => { 
    let displacement = convertRange(rotationAmountCard, {min:-maxRotationX, max:maxRotationX}, {min:-displacementCard, max:displacementCard});;

    let rotationX = displacementCard //rotationAmountCard;
    let movementX = rotationX*displacement;

    if(displacementFilter != null){ //Check if null, because it needs to be loaded first
      displacementFilter.scale.x = -movementX;
      overlayDisplacementFilter.scale.x = -movementX;
      backgroundDisplacementFilter.scale.x = -movementX;
    }
    background.x = -movementX/2;
    foreground.x = -movementX/2;
    foreground2.x = -movementX/2;
    return () => {
      
    };
  }, [rotationAmountCard]);

  //Rotate the card when the value of rotationAmountCard changes
  useEffect(() => {
    if(refApp == null) return;
    if(!playAnim) return;

    let rotationAmount = convertRange(rotationAmountCard, {min:-maxRotationX, max:maxRotationX}, {min:-maxAnimationRotationCard, max:maxAnimationRotationCard});;

    gsap.set(refApp, {rotationY: rotationAmount}); //rotate the app dom element
  }, [rotationAmountCard]);

  useEffect(() => {
    if(refApp == null) return;
    refApp.appendChild(app.renderer.view);

    return () => {
      
    };
  }, [refApp, innited]);

  // On first render load our application
  useEffect(() => {
    setupApp();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  function setupApp(){
    app = new PIXI.Application({
      width: width,
      height: height,
      antialias: false, // default: false
      backgroundAlpha: false, // default: false
      resolution: 1, // default: 1
      autoStart: false,
    })

    app.renderer.resize(width * 1.2 , height); //Add extra width for when the foreground goes over the card
    app.renderer.view.style.position = 'relative';
    app.start();
    pixiHelper = new PixiHelper(app);
    setInnited(true);

    addContainers();
    loadTextures();
    setRotationDisplacement();

    PIXI.Ticker.shared.add((time) =>  animate());
  }

  function setRotationDisplacement(){
    const data = dataImageExceptions.map( (data)=>{
      let numberSprite = jsonName.split('-')[0]; //Get the number of the character from the card
      let cardNumber = data.number;

      if(numberSprite == cardNumber){
        rotationDisplacement = data.rotationDisplacement;
        setDisplacementCard(rotationDisplacement); //set the exception displacement, otherwise you get the default value
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
        fadeOutEffect(loader.current);
        setTextures();
        addChildren();
        setDisplacement();
        setAllTexts();
    });
    ploader.load();
  }

  function fadeOutEffect(fadeTarget)
  {
      // Fade the html element
      var fadeEffect = setInterval(function () {
          if (!fadeTarget.style.opacity) {
              fadeTarget.style.opacity = 1;
          }
          if (fadeTarget.style.opacity > 0) {
              fadeTarget.style.opacity -= 0.01;
          } else {
              setPlayAnim(true); //play animation when fade out is done
              clearInterval(fadeEffect);
          }
      }, 1)
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

    foregroundTexure = pixiHelper.setSprite('06-Back.png', -30, 0, scale, spritesheetContent);
    avatarIcon = pixiHelper.setSprite('02-Avatar.png', 0, 0, scale, spritesheetContent);
    maskOverlapTexture = pixiHelper.setSprite('03-Front.png', -30, 0, scale, spritesheetContent);
    backgroundTexture = pixiHelper.setSprite('08-Background.png', -displacementBackgroundOffset, 0, scale, spritesheetContent)

    displacement = pixiHelper.setDisplacementSprite(scale, '06-Back-depth.png', -30, 0, spritesheetContent);
    overlayDisplacement = pixiHelper.setDisplacementSprite(scale, '06-Back-depth.png', -30, 0, spritesheetContent);
    backgroundDisplacement = pixiHelper.setDisplacementSprite(scale, '08-Background-depth.png', 0, 0, spritesheetContent);

    // Set a mask that will be used to hide elements outside the card
    image.mask = mask;
  }

  //Add the displacement filters to the textures
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

    /**
 * Convert value from one range to another
 * @param {Number} value value to convert
 * @param {Object} oldRange min, max of values range
 * @param {Object} newRange min, max of desired range
 * @return {Number} value converted to other range
 */
  function convertRange(value, oldRange, newRange) {
    return ((value - oldRange.min) * (newRange.max - newRange.min)) / (oldRange.max - oldRange.min) + newRange.min;
  }

  function animate() {
    if(!app) return;   

    // Render the app each frame for the animation and displacement
    app.renderer.render(stage); 
  }

  return  <div ref={wrap} style={{perspective:'1000px',transformOrigin:'50% 50%', width:'100%',height:'100%'}}>
            <div ref={ref => setRefApp(ref)} style={{position: 'absolute', width:'120%'}}></div>
            <img ref={loader} src={loadingSprite} style={{position:'absolute', width:'100%'}}/>
          </div>
}

export default MyComponent;