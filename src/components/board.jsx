
import { useRef, useEffect } from 'react';
import './board.css'


function Board({width, height, theref, context, brushcolor, lineWidth}) {

    
    console.log(` the width: ${width}, ${height}, and the ref`)
    console.log(` getting stuff ${context}`)

    const draw = useRef(false)

    //functions

    const MouseDown = () => {
        draw.current = true
    }

    const MouseUp = () => {
        draw.current = false
    }



    //checking to see if the player is drawing
    useEffect(()=>{

        const handleMouseMove = (event) =>{

            if (!context.current) return

            if (draw.current == false) return
            context.current.beginPath()
            context.current.arc(event.clientX, event.clientY, lineWidth, 0, 2 * Math.PI)
            context.current.fillStyle = brushcolor
            context.current.fill()
            context.current.lineWidth = lineWidth
            
        }

        document.addEventListener("mousedown", MouseDown)

        document.addEventListener("mouseup", MouseUp)

        document.addEventListener("mousemove", handleMouseMove)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mousedown", MouseDown)
            document.removeEventListener("mouseup", MouseUp)
        }

    }, [brushcolor, lineWidth])


    
    /*
    console.log(` the old : ${context.fillStyle}`)
    if (context.current){
        console.log(` the new: ${context.current.fillStyle}`)
    }
    */


    return (

        <>
            <canvas className="Board" width={width} height={height} ref={theref} > 
               
                
            </canvas>
        </>

    )
}

export default Board