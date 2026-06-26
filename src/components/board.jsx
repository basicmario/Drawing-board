
import { useRef, useEffect, useState } from 'react';
import './board.css'


function Board({width, height, brushcolor, lineWidth, theselector, theboardColor, theTextSize}) {


    //storing variables
    const pointsHolder = useRef([])
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

    const alreadyInText = useRef(false)


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
        theContext2.current.font = `${theTextSize}px Arial`; 
        theContext2.current.fillStyle =  brushcolor;

        if(event.code != "Enter") {
            
            theContext2.current.clearRect(0,0, width, height)

            setKeyInputsHolder(prev => prev + (event.key))
            
            textholder.current = textholder.current + event.key
            console.log("text:" ,textholder.current)
            theContext2.current.fillText(textholder.current, mousePos.current.x, mousePos.current.y)
        }

        if(event.code == "Enter"){
            theContext2.current.clearRect(0,0, width, height)
            theContext.current.fillStyle =  brushcolor;
            theContext.current.font = `${theTextSize}px Arial`;  
            theContext.current.fillText(textholder.current, mousePos.current.x, mousePos.current.y)
            textholder.current = ""
            alreadyInText.current = false
            document.removeEventListener("keydown", keyDown)
        }

        
    }

    


    //functions
    const MouseDown = (event) => {
        draw.current = true
        if(theselector == "Brush"){
            
            theContext.current.beginPath()

            theContext2.current.beginPath()
            startingPosition.current = {startingX : event.clientX, startingY : event.clientY}
            pointsHolder.current.push({x: event.clientX, y: event.clientY})
        }else if(theselector == "Square"){
            
            squareDownInitialHolder.current.x = event.clientX
            squareDownInitialHolder.current.y = event.clientY
        }else if(theselector == "Text"){
            
            
            mousePos.current = {x: event.clientX, y: event.clientY}
            
            if(alreadyInText.current == false){
                document.addEventListener("keydown", keyDown)
            }
            
            alreadyInText.current = true
            
        }
    }

    const MouseUp = (event) => {
        draw.current = false

        if(theselector == "Brush"){
            
            theContext.current.beginPath()
            let startingPoints = pointsHolder.current[0]
            theContext.current.lineCap = "round"
            theContext2.current.clearRect(0,0, width, height)
            theContext.current.moveTo(startingPoints.x, startingPoints.y)

            for (let x = 1; x < pointsHolder.current.length; x++){

                const prev = {x: startingPoints.x, y: startingPoints.y}
                const midX = (prev.x + pointsHolder.current[x].x) / 2
                const midY = (prev.y + pointsHolder.current[x].y) / 2


                theContext.current.quadraticCurveTo(prev.x, prev.y, midX, midY)
                theContext.current.strokeStyle = brushcolor
                theContext.current.lineWidth = lineWidth
                
                startingPoints = {x : midX, y : midY}
            }  

            theContext.current.stroke()
            pointsHolder.current.length = 0
        }

        if(theselector == "Square"){
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
                theContext2.current.lineCap = "round"
                theContext2.current.moveTo(startingPosition.current.startingX, startingPosition.current.startingY)
                const prev = {x: startingPosition.current.startingX, y: startingPosition.current.startingY}
                const midX = (prev.x + event.clientX) / 2
                const midY = (prev.y + event.clientY) / 2

                theContext2.current.quadraticCurveTo(prev.x, prev.y, midX, midY)
                theContext2.current.strokeStyle = brushcolor
                theContext2.current.lineWidth = lineWidth
                theContext2.current.stroke()
                startingPosition.current = {startingX : midX, startingY : midY}
                

                pointsHolder.current.push({x : event.clientX, y: event.clientY})

            }else if(theselector == "Square"){
                

                theContext2.current.clearRect(0,0, width, height)
                theContext2.current.strokeStyle = brushcolor
                theContext2.current.strokeRect(squareDownInitialHolder.current.x, squareDownInitialHolder.current.y, (event.clientX - squareDownInitialHolder.current.x) , (event.clientY - squareDownInitialHolder.current.y) )
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