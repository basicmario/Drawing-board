
import { useRef, useEffect } from 'react';
import './board.css'


function Board({width, height, theref, context, brushcolor, lineWidth}) {


    //storing variables
    const pointsHolder = []
    const draw = useRef(false)
    console.log(` the width: ${width}, ${height}, and the ref`)
    console.log(` getting stuff ${context}`)
    const startingPosition = useRef({startingX : 0, startingY : 0})



    //functions
    const MouseDown = (event) => {
        draw.current = true
        context.current.beginPath()
        startingPosition.current = {startingX : event.clientX, startingY : event.clientY}
    }

    const MouseUp = () => {
        draw.current = false

        for (let x = 0; x < pointsHolder.length; x++){
            console.log(`the points are: ${pointsHolder[x].x}, ${pointsHolder[x].y}`)
        }
    }



    //checking to see if the player is drawing
    useEffect(()=>{

        const handleMouseMove = (event) =>{

            if (!context.current) return

            if (draw.current == false) return
            context.current.lineCap = "round"
            context.current.moveTo(startingPosition.current.startingX, startingPosition.current.startingY)


            const prev = {x: startingPosition.current.startingX, y: startingPosition.current.startingY}
            const midX = (prev.x + event.clientX) / 2
            const midY = (prev.y + event.clientY) / 2

            context.current.quadraticCurveTo(prev.x, prev.y, midX, midY)
            context.current.strokeStyle = brushcolor
            context.current.lineWidth = lineWidth
            context.current.stroke()
            startingPosition.current = {startingX : midX, startingY : midY}


            pointsHolder.push({x : event.clientX, y: event.clientY})
            
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