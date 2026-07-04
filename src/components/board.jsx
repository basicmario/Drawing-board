
import { useRef, useEffect, useState } from 'react';
import { IoHandLeftOutline } from "react-icons/io5";
import './board.css'


//classes to hold the data for the history container

class BrushData{
    constructor(lineSize, BrushColor, dataPoints){
        this.lineSize = lineSize
        this.BrushColor = BrushColor
        this.dataPoints = dataPoints
        this.type = "Brush"
    }
}


class SquareData{
    constructor(lineSize, BrushColor, height, width, startingPoint){
        this.type = "square"
        this.lineSize = lineSize
        this.BrushColor = BrushColor
        this.height = height
        this.width = width
        this.startingPoint = startingPoint
    }
}


class TriangleData{
    constructor(lineSize, BrushColor, height, width, moveToPoint, firstLinePoint, secondLinePoint, thirdLinePoint){
        this.lineSize = lineSize
        this.type = "Triangle"
        this.BrushColor = BrushColor
        this.movetopoint = moveToPoint
        this.height = height
        this.width = width
        this.firstlinepoint = firstLinePoint
        this.secondlinepoint = secondLinePoint
        this.thirdlinepoint = thirdLinePoint
    }
}


class ArrowData{
    constructor(lineSize, BrushColor, endPoint, startingPointforLine){
        this.type = "arrow"
        this.lineSize = lineSize
        this.BrushColor = BrushColor
        this.endPoint = endPoint
        this.startingPoint = startingPointforLine
        
    }
}


class TextData{
    constructor(fontSize, BrushColor, startPoint, theText){
        this.lineSize = fontSize
        this.BrushColor = BrushColor
        this.startPoint = startPoint
        this.theText = theText
    }
}





function Board({width, height, brushcolor, lineWidth, theselector, theboardColor, theTextSize, updateZoomValue}) {


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

    const panMousePos = useRef({x: null, y: null})

    const historyHolder = useRef([])
    const translateValues = useRef({x: 0, y: 0})

    const zoomValue = useRef(100)
    const mousePosforZooming = useRef({x: null, y: null})
    const previousmousecoordinates = useRef({x: null, y: null})

    const triangleStartPos = useRef({x: null, y: null})
    



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

        canvas.style.backgroundColor = theboardColor


    },[])

    useEffect(()=> {
        theContext.current.fillStyle = theboardColor;
       

        theContext2.current.fillStyle = theboardColor;
       


        for (let x = 0; x < historyHolder.current.length; x++) {
            switch (historyHolder.current[x]?.type) {
                case "square":
                    theContext.current.fillStyle = historyHolder.current[x].BrushColor;
                    theContext.current.fillRect(
                        historyHolder.current[x].startingPoint.x,
                        historyHolder.current[x].startingPoint.y,
                        historyHolder.current[x].width,
                        historyHolder.current[x].height
                    );
                    break;

                case "arrow":
                    theContext.current.beginPath()
                    theContext.current.strokeStyle = historyHolder.current[x].BrushColor
                    theContext.current.lineWidth = historyHolder.current[x].lineSize
                    theContext.current.moveTo(historyHolder.current[x].startingPoint.x, historyHolder.current[x].startingPoint.y)

                    theContext.current.lineTo(historyHolder.current[x].endPoint.x, historyHolder.current[x].endPoint.y)
                    theContext.current.stroke()
                    
                    break;
            }   
        }
        //to do: when the window is resized it deletes all the text that was there
    },[theboardColor, width, height])
    



    const keyDown = (event) => {
        theContext2.current.font = `${theTextSize}px Arial`; 
        theContext2.current.fillStyle =  brushcolor;
        
        if(event.code == "Backspace"){
            const lengthofWord = textholder.current.length
            textholder.current = textholder.current.slice(0, (lengthofWord - 1))
            theContext2.current.clearRect(0,0, width, height)
            theContext2.current.fillText(textholder.current, mousePos.current.x, mousePos.current.y)
        }

        if(event.code != "Enter") {

            if(event.code == "Backspace") return
                
            theContext2.current.clearRect(0,0, width, height)

            setKeyInputsHolder(prev => prev + (event.key))
            
            textholder.current = textholder.current + event.key
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

    
    //checking to see if the player is drawing
    useEffect(()=>{
        
        if(theselector == "Pan"){
            panSelected.current = true
        }else{
            panSelected.current = false
        }


        //changing the mouse icon based on what tool is elected
        if(theselector == "Brush"){
            document.body.style.cursor = 'url("pencil.png") 0 16, auto'
        }else{
            document.body.style.cursor = 'auto'
        }

        const MouseDown = (event) => {
            draw.current = true

            if(theselector == "Brush"){
                
                theContext.current.beginPath()
                theContext2.current.beginPath()
                startingPosition.current = {startingX : event.clientX, startingY : event.clientY}
                pointsHolder.current.push({x: event.clientX, y: event.clientY})
            }else if(theselector == "Square"){
                
                squareDownInitialHolder.current.x = event.clientX //+ translateValues.current.x// ← subtract offset
                squareDownInitialHolder.current.y = event.clientY //+ translateValues.current.y

            }else if(theselector == "Text"){
        
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

                }
            }else if(theselector == "Pan"){
                
                document.body.style.cursor = 'url("/NewPanOpenSmall.png"), auto';
           
                panMousePos.current = {x: event.clientX, y: event.clientY}

            }else if(theselector == "Arrows"){


                mousePos.current = {x: event.clientX, y: event.clientY}
            }else if(theselector == "Triangle"){
                triangleStartPos.current.x = event.clientX
                triangleStartPos.current.y = event.clientY
            }
        }

        const MouseUp = (event) => {
            draw.current = false

            if(theselector == "Brush"){
                
                theContext.current.beginPath()
                let startingPoints = pointsHolder.current[0]
                theContext.current.lineCap = "round"
                theContext2.current.clearRect(0,0, width, height)

                theContext.current.moveTo(( startingPoints.x - translateValues.current.x) /  (zoomValue.current / 100), (startingPoints.y - translateValues.current.y) / (zoomValue.current / 100))
                let oldcount = 0;
                let prev;
                let midX;
                let midY;

                for (let x = 1; x < pointsHolder.current.length; x++){

                    if(oldcount == 0){
                        prev = {x: ( startingPoints.x - translateValues.current.x)/ (zoomValue.current / 100)  , y: (startingPoints.y - translateValues.current.y) /  (zoomValue.current / 100)}
                        midX = (prev.x + ((pointsHolder.current[x].x- translateValues.current.x) /  (zoomValue.current / 100))) / 2
                        midY = (prev.y + ((pointsHolder.current[x].y - translateValues.current.y)/  (zoomValue.current / 100))) / 2

                    }else{
                        prev = {x: startingPoints.x, y: startingPoints.y}
                        midX = (prev.x + ((pointsHolder.current[x].x- translateValues.current.x) /  (zoomValue.current / 100))) / 2
                        midY = (prev.y + ((pointsHolder.current[x].y - translateValues.current.y)/  (zoomValue.current / 100))) / 2
                    }
                    
                    theContext.current.strokeStyle = brushcolor
                    theContext.current.quadraticCurveTo(prev.x, prev.y, midX, midY)
                    theContext.current.lineWidth = (lineWidth / (zoomValue.current / 100)) 
                    theContext.current.stroke()
                    
                    startingPoints = {x : midX, y : midY}
                    oldcount = oldcount + 1
                }  

                const copyofPointHoler = structuredClone(pointsHolder.current)
                const replicatosend = []

                let oldZoomValue = zoomValue.current
                
                let pointx;
                let pointy;

                for (let obj = 0; obj < copyofPointHoler.length; obj++){

                    
                    pointx = (copyofPointHoler[obj].x - translateValues.current.x) / (oldZoomValue / 100)
                    pointy = (copyofPointHoler[obj].y - translateValues.current.y) / (oldZoomValue / 100)
                    
                    const newPoint = {x : pointx, y : pointy}
                    replicatosend.push(newPoint)
                    
                }

                const newBrushData = new BrushData((lineWidth / (zoomValue.current / 100)), brushcolor, replicatosend)
                historyHolder.current.push(newBrushData)


                
                pointsHolder.current.length = 0
                
            }

            if(theselector == "Square"){
                theContext2.current.clearRect(0,0, width, height)

                theContext.current.fillStyle =  brushcolor;
                theContext.current.fillRect((squareDownInitialHolder.current.x - translateValues.current.x) / (zoomValue.current / 100), 
                                            (squareDownInitialHolder.current.y - translateValues.current.y) / (zoomValue.current / 100), 
                                            (event.clientX - squareDownInitialHolder.current.x) / (zoomValue.current / 100), 
                                            (event.clientY - squareDownInitialHolder.current.y) / (zoomValue.current / 100))

                const newSquare = new SquareData(
                    lineWidth, 
                    brushcolor, 
                    (event.clientY - squareDownInitialHolder.current.y) / (zoomValue.current / 100), // height
                    (event.clientX - squareDownInitialHolder.current.x) / (zoomValue.current / 100), //width
                    {
                        x: (squareDownInitialHolder.current.x - translateValues.current.x) / (zoomValue.current / 100), // starting point x
                        y: (squareDownInitialHolder.current.y - translateValues.current.y) / (zoomValue.current / 100) // starting point y
                    })

                historyHolder.current.push(newSquare)


            }else if(theselector == "Pan"){

                document.body.style.cursor = ""
                panSelected.current = false
                panMousePos.current = {x: null, y: null}

            }else if(theselector == "Arrows"){
                theContext2.current.clearRect(0,0, width, height)

                theContext.current.beginPath()
                theContext.current.strokeStyle = brushcolor
                theContext.current.lineWidth = lineWidth
                theContext.current.moveTo(
                    (mousePos.current.x - translateValues.current.x) / (zoomValue.current / 100),
                    (mousePos.current.y - translateValues.current.y) / (zoomValue.current / 100))
                theContext.current.lineTo(
                (event.clientX - translateValues.current.x) / (zoomValue.current / 100),
                ( event.clientY - translateValues.current.y) / (zoomValue.current / 100))
                theContext.current.stroke()

                const beginningPoint = { 
                    x: (mousePos.current.x - translateValues.current.x) / (zoomValue.current / 100)
                    , y: (mousePos.current.y - translateValues.current.y) / (zoomValue.current / 100)}
               
                mousePos.current.x = null
                mousePos.current.y = null

                const endpoint = {
                    x: (event.clientX - translateValues.current.x) / (zoomValue.current / 100), 
                    y: (event.clientY - translateValues.current.y) / (zoomValue.current / 100)}
                
                const newArrow = new ArrowData(lineWidth, brushcolor, endpoint, beginningPoint)

                historyHolder.current.push(newArrow)
            }else if(theselector == "Triangle"){


                theContext2.current.clearRect(0,0, width, height)
                theContext.current.lineWidth = lineWidth
                theContext.current.strokeStyle = brushcolor

                const triangleWidth = event.clientX - triangleStartPos.current.x 
                const triangleHeight = event.clientY - triangleStartPos.current.y

                theContext.current.beginPath();
                
                //top middle line to bottom right point
                theContext.current.moveTo(((event.clientX - triangleWidth) - translateValues.current.x) / (zoomValue.current / 100), 
                                            ((event.clientY) - translateValues.current.y) / (zoomValue.current / 100)) // starting point of the triangle the left point
                
                
                theContext.current.lineTo(((triangleStartPos.current.x + (triangleWidth / 2))  - translateValues.current.x) / (zoomValue.current / 100), 
                                            (triangleStartPos.current.y - translateValues.current.y) / (zoomValue.current / 100)) //draws a line from the start point to the top point

               
                theContext.current.lineTo((event.clientX - translateValues.current.x) / (zoomValue.current / 100), 
                                            (event.clientY - translateValues.current.y) / (zoomValue.current / 100)) // then from the top most point to where the mouse is, which would be the right most point
                
                
                theContext.current.lineTo(((event.clientX - triangleWidth) - translateValues.current.x) / (zoomValue.current / 100), 
                                            (event.clientY - translateValues.current.y) / (zoomValue.current / 100)) // from the right most point to the start point


                theContext.current.stroke()

                const themovetopoint = {x: (((event.clientX - triangleWidth) - translateValues.current.x) / (zoomValue.current / 100)), 
                                        y: ((event.clientY) - translateValues.current.y) / (zoomValue.current / 100)}

                const firstpoint = {x: ((triangleStartPos.current.x + (triangleWidth / 2))  - translateValues.current.x) / (zoomValue.current / 100), 
                                    y: (triangleStartPos.current.y - translateValues.current.y) / (zoomValue.current / 100)}

                const secondpoint = {x: (event.clientX - translateValues.current.x) / (zoomValue.current / 100), 
                                    y: (event.clientY - translateValues.current.y) / (zoomValue.current / 100)}

                const thirdpoint = {x: ((event.clientX - triangleWidth) - translateValues.current.x) / (zoomValue.current / 100), 
                                    y: (event.clientY - translateValues.current.y) / (zoomValue.current / 100)}


                const newTringle = new TriangleData(lineWidth, brushcolor, triangleHeight, triangleWidth, themovetopoint, firstpoint, secondpoint, thirdpoint)

                historyHolder.current.push(newTringle)

                
            }
    
        }



        const handleMouseMove = (event) =>{

            if (!theContext.current) return
            if (draw.current == false ) return

            

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


                const dx = event.clientX - panMousePos.current.x
                const dy = event.clientY - panMousePos.current.y

                translateValues.current.x += dx 
                translateValues.current.y += dy 

                panMousePos.current.x  = event.clientX
                panMousePos.current.y = event.clientY

                theContext.current.clearRect(0, 0, width, height)
                //theContext.current.fillStyle = theboardColor
                //theContext.current.fillRect(0, 0, width, height)

                theContext.current.setTransform(1, 0, 0, 1, 0, 0)
                theContext.current.clearRect(0, 0, width, height)

                theContext.current.translate(translateValues.current.x, translateValues.current.y)
                theContext.current.scale(zoomValue.current / 100, zoomValue.current / 100)

                for (let x = 0; x < historyHolder.current.length; x++) {
                    switch (historyHolder.current[x]?.type) {
                        case "square":
                            theContext.current.fillStyle = historyHolder.current[x].BrushColor;
                            theContext.current.fillRect(
                                historyHolder.current[x].startingPoint.x,
                                historyHolder.current[x].startingPoint.y,
                                historyHolder.current[x].width,
                                historyHolder.current[x].height
                            );
                            break;

                        case "arrow":
                            theContext.current.beginPath()
                            theContext.current.strokeStyle = historyHolder.current[x].BrushColor
                            theContext.current.lineWidth = historyHolder.current[x].lineSize
                            theContext.current.moveTo(historyHolder.current[x].startingPoint.x, historyHolder.current[x].startingPoint.y)

                            theContext.current.lineTo(historyHolder.current[x].endPoint.x, historyHolder.current[x].endPoint.y)
                            theContext.current.stroke()
                            
                            break;

                        case "Triangle" : {


                            theContext.current.lineWidth = historyHolder.current[x].lineSize
                            theContext.current.strokeStyle = historyHolder.current[x].BrushColor

                            let triangleWidth = event.clientX - triangleStartPos.current.x 
                            let triangleHeight = event.clientY - triangleStartPos.current.y

                            theContext.current.beginPath();
                            
                            //top middle line to bottom right point
                            theContext.current.moveTo(historyHolder.current[x].movetopoint.x, historyHolder.current[x].movetopoint.y) // starting point of the triangle the left point
                            theContext.current.lineTo(historyHolder.current[x].firstlinepoint.x, historyHolder.current[x].firstlinepoint.y) //draws a line from the start point to the top point

                        
                            theContext.current.lineTo(historyHolder.current[x].secondlinepoint.x, historyHolder.current[x].secondlinepoint.y) // then from the top most point to where the mouse is, which would be the right most point
                            theContext.current.lineTo(historyHolder.current[x].thirdlinepoint.x, historyHolder.current[x].thirdlinepoint.y) // from the right most point to the start point
                            theContext.current.stroke()
                            
                            break
                        }
                        case "Brush": {

                            theContext.current.beginPath()
                            theContext.current.lineCap = "round"
                            theContext2.current.clearRect(0,0, width, height)

                            let thenewStartPoint = {x: historyHolder.current[x].dataPoints[0].x, y: historyHolder.current[x].dataPoints[0].y}

                            theContext.current.moveTo(thenewStartPoint.x, thenewStartPoint.y)

                            for (let p = 1; p < historyHolder.current[x].dataPoints.length; p++){

                                const prev = {x: thenewStartPoint.x, y: thenewStartPoint.y}
                                const midX = (prev.x + historyHolder.current[x].dataPoints[p].x) / 2
                                const midY = (prev.y + historyHolder.current[x].dataPoints[p].y) / 2

                                
                                theContext.current.lineWidth = historyHolder.current[x].lineSize 
                                theContext.current.strokeStyle = historyHolder.current[x].BrushColor
                                theContext.current.quadraticCurveTo(prev.x, prev.y, midX, midY)
                                
                           
                                
                                thenewStartPoint = {x : midX, y : midY}
                            }

                            theContext.current.stroke()
                            pointsHolder.current.length = 0

                            break
                        }
                    }   
                }
            }else if(theselector == "Arrows"){

                
                theContext2.current.clearRect(0,0, width, height)
                theContext2.current.beginPath()
                theContext2.current.strokeStyle = brushcolor
                theContext2.current.lineWidth = lineWidth
                theContext2.current.moveTo(mousePos.current.x, mousePos.current.y)
                theContext2.current.lineTo(event.clientX, event.clientY)
                theContext2.current.stroke()
            }else if(theselector == "Triangle"){

                theContext2.current.clearRect(0,0, width, height)
                theContext2.current.lineWidth = lineWidth
                theContext2.current.strokeStyle = brushcolor
                theContext2.current.fillStyle = theboardColor


                const triangleWidth = event.clientX - triangleStartPos.current.x 
                const triangleHeight = event.clientY - triangleStartPos.current.y

                theContext2.current.beginPath();
                
                //top middle line to bottom right point
                theContext2.current.moveTo(event.clientX - triangleWidth, (event.clientY))
                theContext2.current.lineTo(triangleStartPos.current.x + (triangleWidth / 2), triangleStartPos.current.y)

               
                theContext2.current.lineTo(event.clientX, event.clientY)
                theContext2.current.lineTo(event.clientX - triangleWidth, event.clientY)
                theContext2.current.stroke()
            }
        }



        function zooming(event){
           
            mousePosforZooming.current.x = event.clientX
            mousePosforZooming.current.y = event.clientY

            let oldZoomValue = zoomValue.current
            
            if(event.deltaY == 100 && zoomValue.current > 1){
                zoomValue.current = zoomValue.current - 1
                updateZoomValue(zoomValue.current)
            }else if(event.deltaY == -100 && zoomValue.current < 200){
                zoomValue.current = zoomValue.current + 1
                updateZoomValue(zoomValue.current)
            }


            let worldX = (event.clientX - translateValues.current.x) / (oldZoomValue / 100)
            let worldY = (event.clientY - translateValues.current.y) / (oldZoomValue / 100)

            let newTranslateX = event.clientX - (worldX * (zoomValue.current / 100))
            let newTranslateY = event.clientY - (worldY * (zoomValue.current / 100))

            theContext.current.clearRect(0, 0, width, height)
            //theContext.current.fillStyle = theboardColor
            //theContext.current.fillRect(0, 0, width, height)
            
            theContext.current.setTransform(1, 0, 0, 1, 0, 0)
            theContext.current.clearRect(0, 0, width, height)


            translateValues.current.x = newTranslateX
            translateValues.current.y = newTranslateY

            theContext.current.translate(translateValues.current.x, translateValues.current.y)
            theContext.current.scale(zoomValue.current / 100, zoomValue.current / 100)


            for (let x = 0; x < historyHolder.current.length; x++) {
                
                switch (historyHolder.current[x]?.type) {
                    case "square":
                        theContext.current.fillStyle = historyHolder.current[x].BrushColor;
                        theContext.current.fillRect(
                            historyHolder.current[x].startingPoint.x,
                            historyHolder.current[x].startingPoint.y,
                            historyHolder.current[x].width,
                            historyHolder.current[x].height
                        );
                        break

                    case "arrow" :
                    
                        theContext.current.beginPath()
                        theContext.current.strokeStyle = historyHolder.current[x].BrushColor
                        theContext.current.lineWidth = historyHolder.current[x].lineSize
                        theContext.current.moveTo(historyHolder.current[x].startingPoint.x, historyHolder.current[x].startingPoint.y)
                        theContext.current.lineTo(historyHolder.current[x].endPoint.x, historyHolder.current[x].endPoint.y)
                        theContext.current.stroke()
                        break;
                    case "Triangle" : {

                        theContext.current.lineWidth = historyHolder.current[x].lineSize
                        theContext.current.strokeStyle = historyHolder.current[x].BrushColor

                        let triangleWidth = event.clientX - triangleStartPos.current.x 
                        let triangleHeight = event.clientY - triangleStartPos.current.y

                        theContext.current.beginPath();
                        
                        //top middle line to bottom right point
                        theContext.current.moveTo(historyHolder.current[x].movetopoint.x, historyHolder.current[x].movetopoint.y) // starting point of the triangle the left point
                        theContext.current.lineTo(historyHolder.current[x].firstlinepoint.x, historyHolder.current[x].firstlinepoint.y) //draws a line from the start point to the top point

                    
                        theContext.current.lineTo(historyHolder.current[x].secondlinepoint.x, historyHolder.current[x].secondlinepoint.y) // then from the top most point to where the mouse is, which would be the right most point
                        theContext.current.lineTo(historyHolder.current[x].thirdlinepoint.x, historyHolder.current[x].thirdlinepoint.y) // from the right most point to the start point
                        theContext.current.stroke()
                        
                        break
                    }
                    case "Brush": {

                        theContext.current.beginPath()
                        theContext.current.lineCap = "round"
                        theContext2.current.clearRect(0,0, width, height)
                        theContext2.current.clearRect(0,0, width, height)

                        let thenewStartPoint = {x: historyHolder.current[x].dataPoints[0].x, y: historyHolder.current[x].dataPoints[0].y}

                        theContext.current.moveTo(thenewStartPoint.x, thenewStartPoint.y)

                        for (let p = 1; p < historyHolder.current[x].dataPoints.length; p++){

                            const prev = {x: thenewStartPoint.x , y: thenewStartPoint.y}
                            const midX = (prev.x + historyHolder.current[x].dataPoints[p].x) / 2
                            const midY = (prev.y + historyHolder.current[x].dataPoints[p].y) / 2


                            theContext.current.quadraticCurveTo(prev.x, prev.y, midX, midY)
                            theContext.current.strokeStyle = historyHolder.current[x].BrushColor
                            theContext.current.lineWidth = historyHolder.current[x].lineSize
                            
                            thenewStartPoint = {x : midX, y : midY}
                        }

                        theContext.current.stroke()
                        pointsHolder.current.length = 0

                        break
                    }
                }
            }
        }
        
    
       
        document.addEventListener("mousedown", MouseDown)
        document.addEventListener("mouseup", MouseUp)
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("wheel", zooming)

        return () => {
           
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mousedown", MouseDown)
            document.removeEventListener("mouseup", MouseUp)
            document.removeEventListener("wheel", zooming)
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