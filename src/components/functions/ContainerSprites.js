import React, { useRef, useEffect, useState } from "react";
import * as Pixi from "pixi.js";

export default function ContainerSprites( app ) {
    const container = new Pixi.Container();

    app.stage.addChild(container);

    // Create a new texture
    const texture = Pixi.Texture.from('/assets/images/cat.png');

    // Create a 5x5 grid of bunnies
    for (let i = 0; i < 25; i++) {
        const bunny = new Pixi.Sprite(texture);
        bunny.anchor.set(0.5);
        bunny.x = (i % 5) * 40;
        bunny.y = Math.floor(i / 5) * 40;
        bunny.scale.x = 0.05;
        bunny.scale.y = 0.05;
        container.addChild(bunny);
    }

    // Move container to the center
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    // Center bunny sprite in local container coordinates
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    // Listen for animate update
    app.ticker.add((delta) => {
        // rotate the container!
        // use delta to create frame-independent transform
        container.rotation -= 0.01 * delta;
    });
  return (
    <div>{app}</div>
  )
}
