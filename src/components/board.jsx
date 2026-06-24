
import { useRef, useEffect, useState } from 'react';
import './board.css'


function Board({width, height, brushcolor, lineWidth, theselector, theboardColor, theTextSize}) {


    //storing variables
    const pointsHolder = []
    const draw = useRef(false)
    const draw2 = useRef(false)
    const theref = useRef(null)
    const theref2 = useRef(null)
    const [keyInputsHolder, setKeyInputsHolder] = useState("")
    const textholder = useRef("")
    const startingPosition = useRef({startingX : 0, startingY : 0})
    const squareDownInitialHolder = useRef({x: null, y :null})

    const theContext = useRef(null)
    const theContext2 = useRef(null)
    const mousePos = useRef({x: null, y: null})


    //function get the canvas element once its mounted
    useEffect(()=>{
        const canvas = theref.current
        const canvas2 = theref2.current

        if(!canvas) return;
        if(!canvas2) return

        let ctx = canvas.getContext("2d")
        let ctx2 = canvas2.getContext("2d")

        theContext.current = ctx
        theContext2.current =ctx2

        theContext.current.fillStyle = theboardColor;
        theContext.current.fillRect(0, 0, (width), (height));

        theContext2.current.fillStyle = theboardColor;
        theContext2.current.fillRect(0, 0, (width), (height));

    },[])

    useEffect(()=> {
        theContext.current.fillStyle = theboardColor;
        theContext.current.fillRect(0, 0, (width), (height));

        theContext2.current.fillStyle = theboardColor;
        theContext2.current.fillRect(0, 0, (width), (height));

        //to do: when the window is resized it deletes all the text that was there
    },[theboardColor, width, height])
    



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
            theContext.current.font = `${theTextSize}px Arial`;  
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
            theContext.current.fillStyle =  brushcolor;
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
    }, [brushcolor, lineWidth, theselector, theTextSize])




    return (

        <>

           <div className="convaswrapper">
             <canvas className='secondBoard' width={width} height={height} ref={theref2}></canvas>
            <canvas className="Board" width={width} height={height} ref={theref} >   </canvas>
           </div>
        </>

    )
}

export default Board