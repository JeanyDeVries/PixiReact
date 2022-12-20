import * as PIXI from "pixi.js";

export default function(textContent, family, fontSize, color, xPos, yPos){
    let text = new PIXI.Text(
      textContent,
      {
        fontFamily: family, 
        fontSize: fontSize, 
        fill: color,
        align: 'center',
      }
    );
    text.x = xPos;
    text.y = yPos;

    return text;
  }