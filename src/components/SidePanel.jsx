

import React from 'react'
import './SidePanel.css'

function SidePanel() {

  const windowSize = {width : window.innerWidth, height: window.innerHeight}
  const panelheight = 350
  return (
    <div className="panel" style={{top: (windowSize.height / 2) - (panelheight/2) }}>
        <p>This is the sidepanel</p>
        <p>Brush Color</p>
          <div className="colorbox">
            <button className='Blue' style={{background: 'blue'}}></button>
            <button className='Red' style={{background: 'red'}}></button>
            <button className='Green' style={{background: 'green'}}></button>
            <button className='Yellow' style={{background: 'yellow'}}></button>
            <button className='Purple' style={{background: 'purple'}}></button>
          </div>
        
    </div>
  )
}

export default SidePanel