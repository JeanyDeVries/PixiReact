import React, { useRef, useEffect, useState } from "react";
import gsap, {Quad} from 'gsap'

let rotationDuration = 50;
let rotationAmount = {rotationAmountX:5,rotationAmountY:0};

let animationRotationCard; 
let maxAnimationRotationCard = 10;
let maxRotationDuration= 5;

function MyComponent({rotationDuration, rotationAmountX}){
    let refApp = useRef(null);
    const [rotationX, setRotationX] = useState(5);

    useEffect(() => {
        // On first render load our application
        setUpAnimation();
    
        return () => {
          // On unload completely destroy the application and all of it's children
          refApp.destroy(true, true);
        };
      }, []);


    function setUpAnimation(){
        if(rotationDuration > maxRotationDuration) rotationDuration = maxRotationDuration;
        if(rotationAmountX > maxAnimationRotationCard) rotationAmountX = maxAnimationRotationCard;
    
        // Set the animation for the card rotation
        rotationAmount = {rotationAmountX:rotationAmountX,rotationAmountY:0};
        animationRotationCard = gsap.to(rotationAmount,{rotationAmountX:-rotationAmount.rotationAmountX,duration:rotationDuration,repeat: -1,yoyo: true,ease:Quad.easeInOut,
          onUpdate:function()
          {
            gsap.set(refApp.current,{rotationY:rotationAmount.rotationAmountX,rotationX:rotationAmount.rotationAmountY});
            setRotationX(-rotationAmount.rotationAmountX);
          }
        });
        animationRotationCard.pause();
        animationRotationCard.progress(0.5);
    }


    return <div ref={refApp} style={{position:'absolute'}}></div>
}

export default MyComponent;