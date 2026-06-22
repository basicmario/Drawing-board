
import Board from './components/board'
import Brush from './components/brush'
import SidePanel from './components/SidePanel'
import './App.css'

import { useEffect, useRef, useState } from 'react'
import TopPanel from './components/TopPanel'



function App() {

    //storing values
    const theContext = useRef(null)
    const [boardColor, setBoardColor] = useState("#3b3b3b")
    const [brushColor, setBrushColor] = useState("#ffffff")
    const [strokeSize, setStrokeSize] = useState(10)
    const [selectedItem, setSelectedItem] = useState("Brush")

    //console.log(`the color: ${boardColor}`)
    //console.log(`the stroke size: ${strokeSize}`)
    

    //creating the board and the context
    const theref = useRef(null)
    const canvaSize = {width: window.innerWidth, height: window.innerHeight}

    //console.log("width: ", canvaSize.width)
    //console.log("height: ", canvaSize.height)

    useEffect(()=>{
        const canvas = theref.current

        if(!canvas) return;

        let ctx = canvas.getContext("2d")
        theContext.current = ctx

        theContext.current.fillStyle = boardColor;
        theContext.current.fillRect(0, 0, (canvaSize.width), (canvaSize.height));

    },[])


    //useeffect to update whenever the board color changes
    useEffect(()=>{
      theContext.current.fillStyle = boardColor;
      theContext.current.fillRect(0, 0, (canvaSize.width), (canvaSize.height));
    },[boardColor])

    useEffect(()=>{
      console.log(`updated on item selector ${selectedItem}`)
    },[selectedItem])


  return (
    <>
      <div className="content-wrapper">
        <Board width={canvaSize.width } height={canvaSize.height} theref={theref} context={theContext} brushcolor={brushColor} lineWidth={strokeSize} 
        theselector={selectedItem}/>
        <Brush context={theContext} brushcolor={brushColor}/>
        <SidePanel boardColorChanger = {setBoardColor} brushColorChanger={setBrushColor} lineWidthChanger={setStrokeSize}/>
        <TopPanel itemSelector={setSelectedItem}/>
      </div>
    </>
  )
}

export default App
