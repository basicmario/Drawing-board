

import React from 'react'
import './TopPanel.css'

import { PiHandPalmBold } from "react-icons/pi";
import { FaRegSquareFull } from "react-icons/fa6";
import { FiTriangle } from "react-icons/fi";
import { FaLongArrowAltRight } from "react-icons/fa";




function TopPanel() {

    const windowSize = {width : window.innerWidth, height: window.innerHeight}
    const panelWidth = 500


  return (
    <div className="TopPanel" style={{top : '5' , left : ((windowSize.width / 2) - (panelWidth/ 2))}}>
        <button> <PiHandPalmBold /> </button>
        <button> <FaRegSquareFull /> </button>
        <button> <FiTriangle /> </button>
        <button> <FaLongArrowAltRight /> </button>

    </div>
  )
}

export default TopPanel