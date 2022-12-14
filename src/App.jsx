import DisneyCard from "./components/PixiJS";
import AnimationCard from "./components/AnimationCard";
import React, { useRef, useEffect, useState } from "react";
import gsap, {Quad} from 'gsap'

function App() {
  let wrap = useRef(null);

  const [rotationAmountCard, setRotation] = useState(1);
  const [refApp, setRefApp] = useState(null);

  let rotationAmount = {rotationAmountX: 10, rotationAmountY: 0};

  useEffect(() => {
    // Set the animation for the card rotation
    let anim = gsap.to(rotationAmount, {
      rotationAmountX: -rotationAmount.rotationAmountX,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: Quad.easeInOut,
      onUpdate: function() {
        setRotation(rotationAmount.rotationAmountX);
      }
    });
  }, []);

  return (<>
    <div className="App" ref={ref => setRefApp(ref)} style={{width: '500px', height: '800px'}}>
        <DisneyCard 
        spriteWhileLoading = {"mickeyCard.png"}
        jsonName = {"1A-2048x"}
        colorCardBar = {'0x5EA13A'}
        colorCardNumber = {'0x5EA13A'}
        titleTxt = {"Mickey Mouse"}
        subtitleTxt = {"#Aventureux"}
        cardNumberTxt = {"01"}
        cardLetterTxt = {"A"}
        healthTxt = {"08"}
        socialTxt = {"10"}
        energyTxt = {"06"}
        rotationAmountCard = {rotationAmountCard}
        maxRotationX = {rotationAmount.rotationAmountX}
      />
    </div>
  </>);
}

export default App;
