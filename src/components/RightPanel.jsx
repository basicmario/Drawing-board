

import React, { useEffect } from "react"
import { useState, useRef} from "react"
import './RightPanel.css'


function RightPanel({getclients}){

    const [show, setShow] = useState(false)
    const [username, setusername] = useState("")
    const [size, setSize] = useState({x: 0, y: 0})
    const websocket = useRef(null)

    const socketmade = useRef(false)
    const lastmousePos = useRef({x : 0, y: 0})

    const wsUri = "ws://127.0.0.1:5174";
    const [clientsonserver, setClientsConnected] = useState([])
    

    

    function onPush(){
        setShow(!show)
        console.log("show", show)
    }


    function setName(){

        const holder = document.getElementById("namebox")
        setusername(holder.value)
        console.log("username: ", holder.value)

        const data = {name: holder.value}
        websocket.current.send(JSON.stringify({"name": holder.value , "mousepos": lastmousePos.current}))
    }

    

    function sendMouseMove(event){
 
        const mousepos = {x: event.clientX, y : event.clientY}
        lastmousePos.current = mousepos

        let holder = document.getElementById("namebox")
        let name = ""
        if (holder != null){
            name = holder.value
        }

        websocket.current.send(JSON.stringify({"name": name , "mousepos": mousepos}))
    }


    



    useEffect(()=>{

        //setting up the websocket
        console.log("RightPanel mounted")
        console.log("socketmade: ", socketmade)

        websocket.current = new WebSocket(wsUri)

        
        function load(event){
            setSize({x: window.innerWidth, y: window.innerHeight})
            console.log("load")
            console.log("x: ", window.innerWidth, "y: ", window.innerWidth)
        }


        function resize(event){
            setSize({x: window.innerWidth, y: window.innerHeight})
            console.log("resize")

            console.log("x: ", window.innerWidth, "y: ", window.innerWidth)
        }


        function connectserver(){
            console.log("CONNECTED TO SERVER");
        }


        function messageserver(event){
            console.log("SERVER: ", JSON.parse(event.data))

            const returndata = JSON.parse(event.data)

            const clientName = returndata.name  

            setClientsConnected(JSON.parse(event.data))
            getclients(JSON.parse(event.data))
        }

        websocket.current.addEventListener("message", messageserver)

        

        window.addEventListener('resize', resize)
        window.addEventListener('load',load )
        window.addEventListener("mousemove", sendMouseMove)



        websocket.current.addEventListener("open", connectserver);
        


        return (()=>{
            window.removeEventListener("resize", resize)
            window.removeEventListener("load", load)
            window.removeEventListener("mousemove", sendMouseMove)
            websocket.current.removeEventListener("open", connectserver)
            websocket.current.removeEventListener("message", messageserver)
            websocket.current.close()
            console.log("RightPanel unmounting")
        })



    },[])




    return (
        <>

        <div className="rightpanel">

            <div className="peopleholder">

                {
                    clientsonserver.map((value, index)=>(
                        <div key={index} className="template">
                            <p>{value.name.charAt(0) || "M"}</p>
                        </div>
                    ))
                }
                
            </div>
            
            

            <button onClick={()=>onPush()}> Share</button>

        </div>

        {show &&
        
            (<div className="middlebox" style={{width: "500px", height: "350px", left: (window.innerWidth/ 2) - (500/2), 
                top: (window.innerHeight/ 2 ) - (350/2)}}>
                
                <div className="titlebar">
                    <p>Enter the code</p>
                </div>

                <div className="form">
                    <input id="namebox" type="text"/>
                    <button onClick={()=>setName()}>Submit</button>
                </div>
            </div>)
            
        }

        </>
    )
}







export default RightPanel