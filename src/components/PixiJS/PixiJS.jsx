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
    var ploader = new PIXI.Loader();

    
function init(){
  ploader.add('fg', 'mickey_trans.png');
  ploader.add('fg_top', 'mickey_trans_spoon.png');
  ploader.add('depth', 'mickey_depth12.png');
  ploader.add('bg', 'mickey_bg.png');
  ploader.add('bg_depth', 'mickey_bg_depth.png');
  ploader.add('card', 'card.png');
  ploader.add('mask', 'mask.png');
  
  ploader.once('complete', start);
  ploader.load();
}

function start() {
  fg = new PIXI.Sprite(ploader.resources.fg.texture);
  topg = new PIXI.Sprite(ploader.resources.fg_top.texture);
  bg = new PIXI.Sprite(ploader.resources.bg.texture);
  background.addChild(bg);
  foreground.addChild(fg);
  card = new PIXI.Sprite(ploader.resources.card.texture);
  mask = new PIXI.Sprite(ploader.resources.mask.texture);
  container.addChild(card);
  container.addChild(mask);
  container.addChild(foreground2);
  foreground2.addChild(topg);
  console.log(card,mask,top)
  
  card.scale.set(0.65)
  mask.scale.set(0.65)

  image.mask = mask;

  //container.addChild(top);
  //background.scale.x = background.scale.y = 0.9;
  
 // shader.filters = [smokeShader];
 // shaderLayer.addChild(shader)
 

  d = new PIXI.Sprite(ploader.resources.depth.texture);
    foreground.addChild(d);
  f = new PIXI.filters.DisplacementFilter(d, 0);
  fg.filters = [f];

  d2 = new PIXI.Sprite(ploader.resources.bg_depth.texture);
  f2 = new PIXI.filters.DisplacementFilter(d2, 0);
  background.addChild(d2);
  bg.filters = [f2];
  foreground.x = foreground2.x =  -15;

  d3 = new PIXI.Sprite(ploader.resources.depth.texture);
  foreground2.addChild(d3);
  f3 = new PIXI.filters.DisplacementFilter(d3, 0);
  topg.filters = [f3];

  //container.addChild(d);
 
  
  // d2 = new PIXI.Sprite(ploader.resources.depthBgd.texture);
  // f2 = new PIXI.filters.DisplacementFilter(d2, 0);
  // displacementBlur2 = new PIXI.filters.DisplacementFilter(d2, 0);
  
  // blurFilter2.filters = [displacementBlur2];
  // bgd.filters = [f2, blurFilter2];
  
  
  animate();
}
var count = 0



function animate() {
	let movementX = vars.rotationX*6;
	let movementY = vars.rotationY*0.5;
  f.scale.x = -movementX;
  f3.scale.x = -movementX;
  f2.scale.x = -movementX;
  background.x = -movementX/2 - 50;
  foreground.x = -movementX/2;
  foreground2.x = -movementX/2;

  count+=0.01

  
  renderer.render(stage);       
  requestAnimationFrame(animate);
}

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
