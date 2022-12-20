import * as PIXI from "pixi.js";

export function setSprite(spriteName, xPos, yPos, scale, spritesheet) {
  let sprite = new PIXI.Sprite(spritesheet.textures[spriteName]);

  if (!spritesheet._frames[spriteName]) return null; //Set null if the frame texture does net exist

  sprite.width = spritesheet._frames[spriteName].frame.w;
  sprite.height = spritesheet._frames[spriteName].frame.h;
  sprite.x = xPos;
  sprite.y = yPos;
  sprite.scale.set(scale);
  return sprite;
}

export function setDisplacementSprite(
  app,
  scale,
  spriteName,
  xPos,
  yPos,
  spritesheet
) {
  const baseTex = spritesheet.textures[spriteName];

  if (!baseTex) return null; //Set null if the frame texture does net exist

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
  sprite.scale.set(scale);

  return sprite;
}

export function setText(textContent, family, fontSize, color, xPos, yPos) {
  let text = new PIXI.Text(textContent, {
    fontFamily: family,
    fontSize: fontSize,
    fill: color,
    align: "center",
  });
  text.x = xPos;
  text.y = yPos;

  return text;
}

export function fadeOutEffect(fadeTarget) {
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.01;
        } else {
            clearInterval(fadeEffect);
        }
    }, 10)
}