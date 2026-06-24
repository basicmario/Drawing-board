

import React, { useEffect } from 'react'
import './TopPanel.css'

import { PiHandPalmBold } from "react-icons/pi";
import { FaRegSquareFull } from "react-icons/fa6";
import { FiTriangle } from "react-icons/fi";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaPaintBrush } from "react-icons/fa";
import { IoText } from "react-icons/io5";
import { LuMousePointer2 } from "react-icons/lu";







function TopPanel({itemSelector}) {

    const windowSize = {width : window.innerWidth, height: window.innerHeight}
    const panelWidth = 500


  return (
    <div className="TopPanel" style={{top : '5' , left : ((windowSize.width / 2) - (panelWidth/ 2))}}>

        <button> <LuMousePointer2 /></button>
        <button> <PiHandPalmBold /> </button>
        <button onClick={()=>itemSelector("Square")}> <FaRegSquareFull /> </button>
        <button> <FiTriangle /> </button>
        <button> <FaLongArrowAltRight /> </button>
        <button onClick={()=>itemSelector("Brush")}><FaPaintBrush /> </button>
        <button onClick={()=>itemSelector("Text")}> <IoText /> </button>
        

    </div>
  )
}

export default TopPanel