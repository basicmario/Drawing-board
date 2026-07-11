

import React, { useEffect } from "react"
import { useState, useRef} from "react"

import './RightPanel.css'


function RightPanel(){

    const [show, setShow] = useState(false)
    const [size, setSize] = useState({x: 0, y: 0})

    function onPush(){
        setShow(!show)

        console.log("show", show)
    }



    useEffect(()=>{

        window.addEventListener('resize', (event)=>{
            setSize({x: window.innerWidth, y: window.innerHeight})
            console.log("resize")

            console.log("x: ", window.innerWidth, "y: ", window.innerWidth)
        })

        window.addEventListener('load', (event)=>{
            setSize({x: window.innerWidth, y: window.innerHeight})
            console.log("load")
            console.log("x: ", window.innerWidth, "y: ", window.innerWidth)
        })
    },[])


    return (
        <>

        <div className="rightpanel">

            <div className="peopleholder">
                <div className="template">
                    <p>M</p>
                </div>

                <div className="template">
                    <p>B</p>
                </div>

                <div className="template">
                    <p>J</p>
                </div>
            </div>

            <button onClick={()=>onPush()}> Share</button>

        </div>

        {show &&
        
            (<div className="middlebox" style={{width: "500px", height: "350px", left: (window.innerWidth/ 2) - (500/2), 
                top: (window.innerHeight/ 2 ) - (350/2)}}>
                <p>Enter the code</p>

                <div className="form">
                    <input type="text"/>
                    <button>Submit</button>
                </div>
            </div>)
            
        }

        </>
    )
}







export default RightPanel