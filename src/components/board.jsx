
import { useRef, useEffect } from 'react';
import './board.css'


function Board({width, height, theref, context}) {

    
    console.log(` the width: ${width}, ${height}, and the ref`)
    console.log(` getting stuff ${context}`)

    const draw = useRef(false)


    //checking to see if the player is drawing
    useEffect(()=>{

        function handleMouseMove(event) {
            if (!context.current) return
            context.current.beginPath()
            context.current.arc(event.clientX, event.clientY, 5, 0, 2 * Math.PI)
            context.current.fillStyle = "#ffffff"
            context.current.fill()
            context.current.lineWidth = 5
        }

        document.addEventListener("mousedown", ()=>{
            // document.addEventListener("mousemove", handleMouseMove)
            console.log("down")
            draw.current = true
        })

        document.addEventListener("mouseup", ()=>{
            //document.removeEventListener("mouseup", handleMouseMove)
            console.log("up")

            draw.current = false
        })

        document.addEventListener("mousemove", (event)=>{
            //console.log("moving")

            if(draw.current == true){
                handleMouseMove(event)
            }
        })

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
        }

    }, [])
    

    console.log(` the old : ${context.fillStyle}`)
    if (context.current){
        console.log(` the new: ${context.current.fillStyle}`)
    }


    return (

        <>
            <canvas className="Board" width={width} height={height} ref={theref} > 
               
                
            </canvas>
        </>

    )
}

export default Board