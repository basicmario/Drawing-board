
import { useRef, useEffect } from 'react';
import './board.css'


function Board({width, height, theref, context, brushcolor, lineWidth, theselector}) {


    //storing variables
    const pointsHolder = []
    const draw = useRef(false)
    const startingPosition = useRef({startingX : 0, startingY : 0})
    const squareDownInitialHolder = useRef({x: null, y :null})


    //functions
    const MouseDown = (event) => {
        draw.current = true
        

        if(theselector == "Brush"){
            console.log("Use Brush stuff here")
            context.current.beginPath()
            startingPosition.current = {startingX : event.clientX, startingY : event.clientY}
        }else if(theselector == "Square"){
            console.log("Square stuff here")
            squareDownInitialHolder.current.x = event.clientX
            squareDownInitialHolder.current.y = event.clientY
            
            
        }
    }

    const MouseUp = (event) => {
        draw.current = false

        if(theselector == "Brush"){
            console.log("yes")
        }else if(theselector == "Square"){
            
            context.current.fillRect(squareDownInitialHolder.current.x, squareDownInitialHolder.current.y, (event.clientX - squareDownInitialHolder.current.x), (event.clientY - squareDownInitialHolder.current.y))
        }
    }

    
    //checking to see if the player is drawing
    useEffect(()=>{

        const handleMouseMove = (event) =>{

            if (!context.current) return
            if (draw.current == false) return
            

            if(theselector == "Brush"){
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
            }else if(theselector == "Square"){
                //context.current.clearRect(0, 0, width, height)
                context.current.strokeStyle = brushcolor
                context.current.strokeRect(squareDownInitialHolder.current.x, squareDownInitialHolder.current.y, (event.clientX - squareDownInitialHolder.current.x) , (event.clientY - squareDownInitialHolder.current.y) )
                
            }

           
            
        }

        document.addEventListener("mousedown", MouseDown)

        document.addEventListener("mouseup", MouseUp)

        document.addEventListener("mousemove", handleMouseMove)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mousedown", MouseDown)
            document.removeEventListener("mouseup", MouseUp)
        }

    }, [brushcolor, lineWidth, theselector])




    return (

        <>
            <canvas className="Board" width={width} height={height} ref={theref} > 
               
                
            </canvas>
        </>

    )
}

export default Board