import * as PIXI from "pixi.js";

export default class PixiHelper
{
    constructor(app){
        this.app = app;
    }

    setSprite(spriteName, xPos, yPos, scale, spritesheet){
        let sprite = new PIXI.Sprite(spritesheet.textures[spriteName]);

        if(!spritesheet._frames[spriteName]) return null; //Set null if the frame texture does net exist

        sprite.width = spritesheet._frames[spriteName].frame.w;
        sprite.height = spritesheet._frames[spriteName].frame.h;
        sprite.x = xPos;
        sprite.y = yPos;
        sprite.scale.set(scale);
        return sprite;
    }

    setDisplacementSprite(scale, spriteName, xPos, yPos, spritesheet){
        const baseTex = spritesheet.textures[spriteName];

        if(!baseTex) return null; //Set null if the frame texture does net exist

        const renderSprite = new PIXI.Sprite(baseTex);

        // Set the position and anchor of the sprite to 0,0 so that it renders the entire image
        renderSprite.position.x = 0;
        renderSprite.position.y = 0;
        renderSprite.anchor.x = 0;
        renderSprite.anchor.y = 0;

        // Create a render texture which causes the sprite to only render the image, 
        // not the basetexture for the displacement
        const renderTexture = PIXI.RenderTexture.create({
            width: baseTex.orig.width,
            height: baseTex.orig.height
        });

        this.app.renderer.render(renderSprite, {
            renderTexture: renderTexture
        });

        let sprite = new PIXI.Sprite(renderTexture);
        sprite.x = xPos;
        sprite.y = yPos;
        sprite.width = baseTex.orig.width;
        sprite.height = baseTex.orig.height;
        sprite.scale.set(scale);

        return sprite;
    }

    setText(textContent, family, fontSize, color, xPos, yPos){
        let text = new PIXI.Text(textContent, {
            fontFamily: family,
            fontSize: fontSize,
            fill: color,
            align: "center"
        });
        text.x = xPos;
        text.y = yPos;

        return text;
    }
}