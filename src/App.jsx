import PixiJS from "./components/PixiJS";
import AnimationCard from "./components/AnimationCard";
import React, { useRef, useEffect, useState } from "react";
import gsap, {Quad} from 'gsap'

function App() {
  let refApp = useRef(null);
  let wrap = useRef(null);

  const [rotation, setRotation] = useState(1);

  // Set the animation for the card rotation
  let rotationAmount = {rotationAmountX:3,rotationAmountY:0};
  let animationRotationCard = gsap.to(rotationAmount,{rotationAmountX:-rotationAmount.rotationAmountX,duration:1,repeat: -1,yoyo: true,ease:Quad.easeInOut,
    onUpdate:function()
    {
      gsap.set(refApp.current,{rotationY:rotationAmount.rotationAmountX,rotationX:rotationAmount.rotationAmountY});
    }
  });
  animationRotationCard.play();
  animationRotationCard.progress(0.5);

  useEffect(() => {
    setRotation(rotationAmount); 
    //console.log(rotationAmount)

    return () => {
      
    };
  }, []);

  return (<>
    <div className="App" ref={refApp}>
        <PixiJS 
        spriteWhileLoading = {"mickeyCard.png"}
        jsonName = {"38-Winnie-2048x"}
        colorCardBar = {'0x5EA13A'}
        colorCardNumber = {'0x5EA13A'}
        titleTxt = {"Mickey Mouse"}
        subtitleTxt = {"#Aventureux"}
        cardNumberTxt = {"01"}
        cardLetterTxt = {"A"}
        healthTxt = {"08"}
        socialTxt = {"10"}
        energyTxt = {"06"}
        rotationAmount = {rotationAmount}
        animationRotationCard = {animationRotationCard}
      />
    </div>
  </>);
}

export default App;
