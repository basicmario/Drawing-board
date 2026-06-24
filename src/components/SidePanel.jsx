

import React from 'react'
import './SidePanel.css'

function SidePanel({boardColorChanger, brushColorChanger, lineWidthChanger, theTextSize}) {

  const windowSize = {width : window.innerWidth, height: window.innerHeight}
  const panelheight = 350



  return (
    <div className="panel" style={{top: (windowSize.height / 2) - (panelheight/2) }}>
        <p>This is the sidepanel</p>
        <p>Brush Color</p>

        
        <div className="colorbox">
          <button className='Blue' style={{background: 'blue'}}  onClick={()=>brushColorChanger("#0843c2")}></button>
          <button className='Red' style={{background: 'red'}} onClick={()=>brushColorChanger("#c20808")}> </button>
          <button className='Green' style={{background: 'green'}} onClick={()=>brushColorChanger("#17990b")}></button>
          <button className='Yellow' style={{background: 'yellow'}} onClick={()=>brushColorChanger("#ded30d")}></button>
          <button className='Purple' style={{background: 'purple'}} onClick={()=>brushColorChanger("#b40dde")}></button>
          <button className='White' style={{background: 'white'}} onClick={()=>brushColorChanger("#ffffff")}></button>
          <button className='White' style={{background: 'black'}} onClick={()=>brushColorChanger("#000000")}></button>
        </div>

        <p>Background Color</p>
        <div className="backgroundcolor">
          <button className='Blue' style={{background: 'blue'}} onClick={()=>boardColorChanger("#0843c2")}></button>
          <button className='Red' style={{background: 'red'}} onClick={()=>boardColorChanger("#c20808")}></button>
          <button className='Green' style={{background: 'green'}} onClick={()=>boardColorChanger("#17990b")}></button>
          <button className='Yellow' style={{background: 'yellow'}} onClick={()=>boardColorChanger("#ded30d")}></button>
          <button className='Purple' style={{background: 'purple'}} onClick={()=>boardColorChanger("#b40dde")}></button>
          <button className='White' style={{background: 'white'}} onClick={()=>boardColorChanger("#ffffff")}></button>
          <button className='White' style={{background: 'black'}} onClick={()=>boardColorChanger("#000000")}></button>
        </div>


        <p>Stroke Width</p>
        <div className="strokewidth">
          <input  type='number' onChange={(event)=>lineWidthChanger(event.target.value)} />
        </div>

        <p>Text Size</p>
        <div className="strokewidth">
          <input  type='number' onChange={(event)=>theTextSize(event.target.value)} />
        </div>
        
    </div>
  )
}

export default SidePanel