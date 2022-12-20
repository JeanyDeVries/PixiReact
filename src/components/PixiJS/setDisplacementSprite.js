import * as PIXI from "pixi.js";

export default function(app, scale, spriteName, xPos, yPos, spritesheet){
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