
import Board from './components/board'
import Brush from './components/brush'
import SidePanel from './components/SidePanel'
import './App.css'

import { useEffect, useRef, useState } from 'react'



function App() {

    //storing values
    const theContext = useRef(null)



    //creating the board and the context
    const theref = useRef(null)
    const canvaSize = {width: window.innerWidth, height: window.innerHeight}
    
    console.log("width: ", canvaSize.width)
    console.log("height: ", canvaSize.height)

    useEffect(()=>{
        const canvas = theref.current

        if(!canvas) return;

        let ctx = canvas.getContext("2d")
        theContext.current = ctx

        theContext.current.fillStyle = "#3b3b3b";
        theContext.current.fillRect(0, 0, (canvaSize.width), (canvaSize.height));

    },[])


  return (
    <>
      <div className="content-wrapper">
        <Board width={canvaSize.width } height={canvaSize.height} theref={theref} context={theContext}/>
        <Brush context={theContext}/>
        <SidePanel />
      </div>
    </>
  )
}

export default App
