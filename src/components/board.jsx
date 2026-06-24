
import { useRef, useEffect, useState } from 'react';
import './board.css'


function Board({width, height, context, brushcolor, lineWidth, theselector, theboardColor}) {


    //storing variables
    const pointsHolder = []
    const draw = useRef(false)
    const [keyInputsHolder, setKeyInputsHolder] = useState("")
    const textholder = useRef("")
    const startingPosition = useRef({startingX : 0, startingY : 0})
    const squareDownInitialHolder = useRef({x: null, y :null})
    const theref = useRef(null)
    const theContext = useRef(null)

    const mousePos = useRef({x: null, y: null})


    //function
    useEffect(()=>{
        const canvas = theref.current

        if(!canvas) return;

        let ctx = canvas.getContext("2d")
        theContext.current = ctx

        theContext.current.fillStyle = theboardColor;
        theContext.current.fillRect(0, 0, (width), (height));

    },[])

    useEffect(()=> {
        theContext.current.fillStyle = theboardColor;
        theContext.current.fillRect(0, 0, (width), (height));
    },[theboardColor])
    



    const keyDown = (event) => {
        if(event.code != "Enter") {
            console.log(` the key : ${event.key}`)
            setKeyInputsHolder(prev => prev + (event.key))
            textholder.current = textholder.current + event.key
        }

        if(event.code == "Enter"){
            console.log(` printing text: ${keyInputsHolder}, ${textholder.current}`)
            theContext.current.fillStyle =  brushcolor;
            //theContext.current.lineWidth = 10; 
            theContext.current.font = "50px Arial";  
            theContext.current.fillText(textholder.current, mousePos.current.x, mousePos.current.y)
            textholder.current = ""
            document.removeEventListener("keydown", keyDown)
        }
    }


    //functions
    const MouseDown = (event) => {
        draw.current = true
        


        if(theselector == "Brush"){
            console.log("Use Brush stuff here")
            theContext.current.beginPath()
            startingPosition.current = {startingX : event.clientX, startingY : event.clientY}
        }else if(theselector == "Square"){
            console.log("Square stuff here")
            squareDownInitialHolder.current.x = event.clientX
            squareDownInitialHolder.current.y = event.clientY
        }else if(theselector == "Text"){
            console.log("drawing text")
            mousePos.current = {x: event.clientX, y: event.clientY}
        
            document.addEventListener("keydown", keyDown)
            
        }
    }

    const MouseUp = (event) => {
        draw.current = false

        if(theselector == "Brush"){
            console.log("yes")
        }else if(theselector == "Square"){
            
            theContext.current.fillRect(squareDownInitialHolder.current.x, squareDownInitialHolder.current.y, (event.clientX - squareDownInitialHolder.current.x), (event.clientY - squareDownInitialHolder.current.y))
        }
    }

    
    //checking to see if the player is drawing
    useEffect(()=>{

        const handleMouseMove = (event) =>{

            if (!theContext.current) return
            if (draw.current == false) return
            

            if(theselector == "Brush"){
                theContext.current.lineCap = "round"
                theContext.current.moveTo(startingPosition.current.startingX, startingPosition.current.startingY)


                const prev = {x: startingPosition.current.startingX, y: startingPosition.current.startingY}
                const midX = (prev.x + event.clientX) / 2
                const midY = (prev.y + event.clientY) / 2

                theContext.current.quadraticCurveTo(prev.x, prev.y, midX, midY)
                theContext.current.strokeStyle = brushcolor
                theContext.current.lineWidth = lineWidth
                theContext.current.stroke()
                startingPosition.current = {startingX : midX, startingY : midY}


                pointsHolder.push({x : event.clientX, y: event.clientY})
            }else if(theselector == "Square"){
                //context.current.clearRect(0, 0, width, height)
                theContext.current.strokeStyle = brushcolor
                theContext.current.strokeRect(squareDownInitialHolder.current.x, squareDownInitialHolder.current.y, (event.clientX - squareDownInitialHolder.current.x) , (event.clientY - squareDownInitialHolder.current.y) )
                
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