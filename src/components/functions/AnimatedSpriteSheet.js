import React, { useRef, useEffect, useState } from "react";
import * as Pixi from "pixi.js";

export default function (app) {

    Pixi.Assets.load('./assets/spritesheets/Character_Walking.json').then(() => {
        // create an array to store the textures
        const walkingTextures = [];
        let i;
    
        for (i = 0; i < 5; i++) {
            const texture = Pixi.Texture.from(`Pink_Monster_Walk${i + 1}.png`);
            walkingTextures.push(texture);
        }
    
        // create an explosion AnimatedSprite
        const animationWalking = new Pixi.AnimatedSprite(walkingTextures);
  
        animationWalking.x = 0;
        animationWalking.y = window.innerHeight;
        animationWalking.animationSpeed = 0.1;
        animationWalking.anchor.x = 0;
        animationWalking.anchor.y = 1;
        animationWalking.scale.set(3);
        animationWalking.gotoAndPlay(0);
        app.stage.addChild(animationWalking);
    });

  return (
    <div>AnimatedSpriteSheet</div>
  )
}
