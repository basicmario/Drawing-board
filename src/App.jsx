
import Board from './components/board'
import Brush from './components/brush'
import SidePanel from './components/SidePanel'
import './App.css'

import { useEffect, useRef, useState } from 'react'
import TopPanel from './components/TopPanel'
import BottomStats from './components/BottomStats'
import RightPanel from './components/RightPanel'



function App() {

    //storing values
    const theContext = useRef(null)
    const [boardColor, setBoardColor] = useState("#3b3b3b")
    const [brushColor, setBrushColor] = useState("#ffffff")
    const [strokeSize, setStrokeSize] = useState(2)
    const [textSize, settextSize] = useState(2)
    const [selectedItem, setSelectedItem] = useState("Brush")
    const [canvaSize, setCanvasSize] = useState({width: window.innerWidth, height: window.innerHeight})
    const [zoomValue, setzoomValue] = useState(100)

    //console.log(`the color: ${boardColor}`)
    //console.log(`the stroke size: ${strokeSize}`)
    

    //creating the board and the context
    //handling board resizes

    window.addEventListener("resize", (event) => {
        setCanvasSize({width: window.innerWidth, height: window.innerHeight})
     })



     function setZoomValue(value){
      setzoomValue(value)
     }
    
    



    //useeffect to update whenever the board color changes
    useEffect(()=>{
      console.log(`updated on item selector ${selectedItem}`)
    },[selectedItem])



    useEffect(()=>{
      function detectKey(event){


        if (event.target.tagName == "INPUT"){
          
          return
        } 

        switch (event.key){
          
          case '1':

            setSelectedItem("Selection")
            break
          case "2":
            console.log("running")
            setSelectedItem("Pan")
            break
          case '3':
            setSelectedItem("Square")
            break
          case '4':
            setSelectedItem("Triangle")
            break
          case '5':
            setSelectedItem("Arrows")
             break
          case '6':
            setSelectedItem("Brush")
            break
          case '7':
            setSelectedItem("Text")
            break
          default:
            setSelectedItem("Brush")
        }
      }


      function detectMSbutton(event){

        
        
        if(event.button == 2){
          setSelectedItem("Pan")
        }


      }

      ///bug when i increase the line width and zoom out it changes the line width for all the drawings


      document.addEventListener('keydown', detectKey)
      document.addEventListener('mousedown', detectMSbutton)
      window.addEventListener('contextmenu', (event)=> event.preventDefault())

      return ()=>{

        document.removeEventListener('keydown', detectKey)
        document.removeEventListener('mousedown', detectMSbutton)
      } 

    },[])


  return (
    <>
      <div className="content-wrapper">
        <Board width={canvaSize.width } height={canvaSize.height} theboardColor={boardColor} context={theContext} brushcolor={brushColor} 
        lineWidth={strokeSize} 
        theselector={selectedItem} 
        theTextSize={textSize}
        updateZoomValue={setZoomValue}/>
        <Brush context={theContext} brushcolor={brushColor}/>
        <SidePanel boardColorChanger = {setBoardColor} brushColorChanger={setBrushColor} thestrokeSize={strokeSize}lineWidthChanger={setStrokeSize} theTextSize={settextSize}/>
        <TopPanel itemSelector={setSelectedItem} keyboardItemChanger={selectedItem}/>
        <BottomStats theZoomValue= {zoomValue}/>
        <RightPanel />
      </div>
    </>
  )
}

export default App
