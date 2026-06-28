
import { BsCursorFill } from "react-icons/bs";
import React, { useEffect, useRef, useState } from 'react'
import './BottomStats.css'

function BottomStats() {

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
            <p> <BsCursorFill /> x : {mouseCoordinates.x} y : {mouseCoordinates.y}</p>
        </div>
        
    

    </>
  )
}

export default BottomStats