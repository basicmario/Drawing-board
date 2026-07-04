

import React, { useEffect, useRef, useState } from 'react'
import './TopPanel.css'

import { PiHandPalmBold } from "react-icons/pi";
import { FaRegSquareFull } from "react-icons/fa6";
import { FiTriangle } from "react-icons/fi";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPaintbrush } from "react-icons/lu";

import { IoText } from "react-icons/io5";
import { LuMousePointer2 } from "react-icons/lu";
import { PiPaintBrush } from "react-icons/pi";
import { LuTypeOutline } from "react-icons/lu";

import { LuSpline } from "react-icons/lu";




//additionally i will be handling the scale of the board through this component



function TopPanel({itemSelector, keyboardItemChanger}) {

    const windowSize = {width : window.innerWidth, height: window.innerHeight}
    const panelWidth = 500




    const [theOption, setTheOption]  = useState("Brush")

    function onButtonClick(Pick){

      itemSelector(Pick)
      setTheOption(Pick)
    }

    

    useEffect(()=>{

      let thebutton = document.getElementById(theOption)

      thebutton.style.backgroundColor = "#bfbfbf"
      

      let otherbuttons = document.getElementsByClassName("topPanelButton")

      for( let x = 0; x < otherbuttons.length; x++){
        
        if(otherbuttons[x].id != theOption){
          otherbuttons[x].style.backgroundColor = "#a6a6a6"
        }

      }

    },[theOption])


    useEffect(()=>{
      let thebutton2 = document.getElementById(keyboardItemChanger)

      thebutton2.style.backgroundColor = "#bfbfbf"

      let otherbuttons = document.getElementsByClassName("topPanelButton")

      for( let x = 0; x < otherbuttons.length; x++){
        
        if(otherbuttons[x].id != thebutton2.id){
          otherbuttons[x].style.backgroundColor = "#a6a6a6"
        }
      }
    },[keyboardItemChanger])



   
    


  return (
    <div className="TopPanel" style={{top : '5' , left : ((windowSize.width / 2) - (panelWidth/ 2))}}>

        <button className= "topPanelButton" id="Selection" onClick={()=>onButtonClick("Selection")}> <LuMousePointer2 /> <span>1</span></button>
        <button className= "topPanelButton" id="Pan" onClick={()=>onButtonClick("Pan")}> <PiHandPalmBold /> <span>2</span></button>
        <button className= "topPanelButton" id="Square" onClick={()=>onButtonClick("Square")}> <FaRegSquareFull /> <span>3</span></button>
        <button className= "topPanelButton" id="Triangle" onClick={()=>onButtonClick("Triangle")} style={{fontSize : "22px"}}> <FiTriangle /> <span>4</span></button>
        <button className= "topPanelButton" id="Arrows" onClick={()=>onButtonClick("Arrows")}  style={{fontSize : "22px"}}> <LuSpline /> <span>5</span></button>
        <button className= "topPanelButton" id="Brush" onClick={()=>onButtonClick("Brush")}> <LuPaintbrush /> <span>6</span></button>
        <button className= "topPanelButton" id="Text" onClick={()=>onButtonClick("Text")}> <LuTypeOutline /> <span>7</span></button>
        

    </div>
  )
}

export default TopPanel