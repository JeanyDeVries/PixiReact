import React, { useRef, useEffect, useState } from "react";
import gsap, {Quad} from 'gsap'

let rotationDuration= 1;
let rotationAmount = {rotationAmountX:5,rotationAmountY:0};
let rotationDisplacement = {rotationDisplacementX:5,rotationDisplacementY:0};

let animationRotationCard; 
let maxAnimationRotationCard = 1000;

function MyComponent({htmlElement, rotationAmountX}){
    useEffect(() => {
        // On first render load our application
        if(htmlElement.current != null)
          setUpAnimation();
      }, []);


    function setUpAnimation(){
        if(rotationAmountX > maxAnimationRotationCard) rotationAmountX = maxAnimationRotationCard;
    
        // Set the animation for the card rotation
        rotationAmount = {rotationAmountX:rotationAmountX,rotationAmountY:0};
        animationRotationCard = gsap.to(rotationAmount,{rotationAmountX:-rotationAmount.rotationAmountX,duration:rotationDuration,repeat: -1,yoyo: true,ease:Quad.easeInOut,
          onUpdate:function()
          {
            gsap.set(htmlElement.current,{rotationY:rotationAmount.rotationAmountX,rotationX:rotationAmount.rotationAmountY});
            //setRotationX(-rotationAmount.rotationAmountX);
          }
        });
        animationRotationCard.play();
        animationRotationCard.progress(0.5);
    }


    return null; // The AnimationComponent doesn't need to render anything to the DOM
}

export default MyComponent;