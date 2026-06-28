
import Board from './components/board'
import Brush from './components/brush'
import SidePanel from './components/SidePanel'
import './App.css'

import { useEffect, useRef, useState } from 'react'
import TopPanel from './components/TopPanel'
import BottomStats from './components/BottomStats'



function App() {

    //storing values
    const theContext = useRef(null)
    const [boardColor, setBoardColor] = useState("#3b3b3b")
    const [brushColor, setBrushColor] = useState("#ffffff")
    const [strokeSize, setStrokeSize] = useState(2)
    const [textSize, settextSize] = useState(2)
    const [selectedItem, setSelectedItem] = useState("Brush")
    const [canvaSize, setCanvasSize] = useState({width: window.innerWidth, height: window.innerHeight})

    //console.log(`the color: ${boardColor}`)
    //console.log(`the stroke size: ${strokeSize}`)
    

    //creating the board and the context
    //handling board resizes

    window.addEventListener("resize", (event) => {
        setCanvasSize({width: window.innerWidth, height: window.innerHeight})
     })
    
    



    //useeffect to update whenever the board color changes
    useEffect(()=>{
      console.log(`updated on item selector ${selectedItem}`)
    },[selectedItem])


  return (
    <>
      <div className="content-wrapper">
        <Board width={canvaSize.width } height={canvaSize.height} theboardColor={boardColor} context={theContext} brushcolor={brushColor} 
        lineWidth={strokeSize} 
        theselector={selectedItem} 
        theTextSize={textSize}/>
        <Brush context={theContext} brushcolor={brushColor}/>
        <SidePanel boardColorChanger = {setBoardColor} brushColorChanger={setBrushColor} lineWidthChanger={setStrokeSize} theTextSize={settextSize}/>
        <TopPanel itemSelector={setSelectedItem}/>
        <BottomStats/>
      </div>
    </>
  )
}

export default App
