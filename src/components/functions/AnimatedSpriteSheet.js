import React, { useRef, useEffect, useState } from "react";
import * as Pixi from "pixi.js";

export default function (app) {
    let player;
    let keys = {};
    let movementSpeed = 5;

    Pixi.Assets.load('./assets/spritesheets/Character_Walking.json').then(() => {        
        // create an array to store the textures
        const walkingTextures = [];
        const jumpTextures = [];

        let i;
    
        for (i = 0; i <= 5; i++) {
            const texture = Pixi.Texture.from(`Pink_Monster_Walk${i}.png`);
            walkingTextures.push(texture);
        }

        for (i = 0; i <= 7; i++) {
          const texture = Pixi.Texture.from(`Pink_Monster_Jump${i}.png`);
          jumpTextures.push(texture);
      }
    
        // create an explosion AnimatedSprite
        player = new Pixi.AnimatedSprite(walkingTextures);
  
        player.x = 0;
        player.y = window.innerHeight;
        player.animationSpeed = 0.1;
        player.anchor.x = 0;
        player.anchor.y = 1;
        player.scale.set(3);
        player.stop();
        player.loop = true;
        app.stage.addChild(player);
    });

    window.addEventListener('keydown', keysDown);
    window.addEventListener('keyup', keysUp);

    app.ticker.add(update);

    function keysDown(key){
        console.log(key.keyCode);
        keys[key.keyCode] = true;
    }

    function keysUp(key){
      console.log(key.keyCode);
      keys[key.keyCode] = false;
      player.stop();
    }

    function update(){
        // W
        if(keys['87']){
            player.y -= movementSpeed;
            player.play();
        }
        // A
        if(keys['65']){
          player.x -= movementSpeed;
          player.play();
        }
        // S
        if(keys['83']){
          player.y += movementSpeed;
          player.play();
        }        
        // D
        if(keys['68']){
          player.x += movementSpeed;
          player.play();
        }
    }

  return (
    <div>AnimatedSpriteSheet</div>
  )
}
