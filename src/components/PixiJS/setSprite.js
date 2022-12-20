import * as PIXI from "pixi.js";

export default function(spriteName, xPos, yPos, scale, spritesheet){
    let sprite = new PIXI.Sprite(spritesheet.textures[spriteName]);

    if(!spritesheet._frames[spriteName]) return null; //Set null if the frame texture does net exist

    sprite.width = spritesheet._frames[spriteName].frame.w;
    sprite.height = spritesheet._frames[spriteName].frame.h;
    sprite.x = xPos;
    sprite.y = yPos;
    sprite.scale.set(scale)
    return sprite;
};