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
      backgroundAlpha: true, // default: false
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
    var d, d2, d3;
    var card;
    var mask;
    var displacementBlur;
    var displacementBlur2;
    var mousex = width, mousey = height;
    var ploader = new PIXI.Loader();

    function init(){
      ploader.add('fg', '/assets/images/mickey_trans.png');
      ploader.add('fg_top', '/assets/images/mickey_trans_spoon.png');
      ploader.add('depth', '/assets/images/mickey_depth12.png');
      ploader.add('bg', '/assets/images/mickey_bg.png');
      ploader.add('bg_depth', '/assets/images/mickey_bg_depth.png');
      ploader.add('card', '/assets/images/card.png');
      ploader.add('mask', '/assets/images/mask.png');
      
      ploader.onComplete.add(() => {start();});
      //ploader.once('complete', start);
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

      
      app.renderer.render(stage);       
      requestAnimationFrame(animate);
    }

    // Start the PixiJS app
    app.start();
    init();

    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  return <div ref={ref} />;
}

export default MyComponent;
