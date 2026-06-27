
import { useRef, useEffect, useState } from 'react';
import { IoHandLeftOutline } from "react-icons/io5";
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
    const panSelected = useRef(false)


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
            //console.log("running 1")
        }else if(theselector == "Square"){
            
            squareDownInitialHolder.current.x = event.clientX
            squareDownInitialHolder.current.y = event.clientY
        }else if(theselector == "Text"){
            
            console.log("alreadyInText", alreadyInText.current)

            if(alreadyInText.current == false){
                mousePos.current = {x: event.clientX, y: event.clientY}
                document.addEventListener("keydown", keyDown)
                alreadyInText.current = true

            }else {

                theContext2.current.clearRect(0,0, width, height)
                theContext.current.fillStyle =  brushcolor;
                theContext.current.font = `${theTextSize}px Arial`;  
                theContext.current.fillText(textholder.current, mousePos.current.x, mousePos.current.y)
                textholder.current = ""
                alreadyInText.current = false

                document.removeEventListener("keydown", keyDown)

                console.log("texted rendered to bottom")
            }
        }else if(theselector == "Pan"){
            
            document.body.style.cursor = 'url("/NewPanOpenSmall.png"), auto';

        }else if(theselector == "Arrows"){

            console.log("Arrow selected")

            mousePos.current = {x: event.clientX, y: event.clientY}
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
           // console.log("running 2")
        }

        if(theselector == "Square"){
            theContext.current.fillStyle =  brushcolor;
            theContext.current.fillRect(squareDownInitialHolder.current.x, squareDownInitialHolder.current.y, (event.clientX - squareDownInitialHolder.current.x), (event.clientY - squareDownInitialHolder.current.y))
        }else if(theselector == "Pan"){

            document.body.style.cursor = ""
            panSelected.current = false

        }else if(theselector == "Arrows"){

            

            theContext2.current.clearRect(0,0, width, height)

            theContext.current.beginPath()
            theContext.current.strokeStyle = brushcolor
            theContext.current.lineWidth = lineWidth
            theContext.current.moveTo(mousePos.current.x, mousePos.current.y)
            theContext.current.lineTo(event.clientX, event.clientY)
            theContext.current.stroke()

            console.log("done with line")
            mousePos.current.x = null
            mousePos.current.y = null

        }
    }

    


    
    
    //checking to see if the player is drawing
    useEffect(()=>{
        
        if(theselector == "Pan"){
            panSelected.current = true
        }else{
            panSelected.current = false
        }


        const handleMouseMove = (event) =>{

            if (!theContext.current) return
            if (draw.current == false || panSelected.current == true) return

            if(theselector == "Brush"){
                //console.log("running")
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
            }else if(theselector == "Pan"){
                //console.log("Running")
                document.body.style.cursor = 'url("/NewPanOpenSmall.png"), auto';
            }else if(theselector == "Arrows"){

                console.log("drawing")
                theContext2.current.clearRect(0,0, width, height)
                theContext2.current.beginPath()
                theContext2.current.strokeStyle = brushcolor
                theContext2.current.lineWidth = lineWidth
                theContext2.current.moveTo(mousePos.current.x, mousePos.current.y)
                theContext2.current.lineTo(event.clientX, event.clientY)
                theContext2.current.stroke()
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