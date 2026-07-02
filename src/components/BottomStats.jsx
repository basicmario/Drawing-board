
import { BsCursorFill } from "react-icons/bs";
import React, { useEffect, useRef, useState } from 'react'
import { TiZoomIn } from "react-icons/ti";

import './BottomStats.css'

function BottomStats({theZoomValue}) {

  const [mouseCoordinates, setmouseCoordinates] = useState({x: null, y: null})

  useEffect(()=>{

    function mouseStats (event){
      setmouseCoordinates({x: event.clientX, y: event.clientY})
    }

    document.addEventListener('mousemove', mouseStats)


    return () => document.removeEventListener("mousemove", mouseStats)
  })


  return (
    <>
        <div className="bottomboard">
            <p> <TiZoomIn /> {theZoomValue}% <BsCursorFill /> x : {mouseCoordinates.x} y : {mouseCoordinates.y}</p>
        </div>
        
    

    </>
  )
}

export default BottomStats