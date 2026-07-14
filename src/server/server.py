import asyncio
import json
import copy
import random

from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosed

clientList = []
clientName = []

idnum = 1


storagewithoutsocket = []
idnumholder = []
storagefortheids = []
count = 0
defaults = 1






async def handler(websocket):
    #print("server running")

    #print("websocket data: ", websocket.local_address, "id: ", websocket.id)
    global count
    global clientDict
    global defaults


    if websocket not in clientList:

        clientList.append(websocket)

        count += 1

        random_int = random.randint(1, 1000)

        if not any(random_int for x in idnumholder):
            storagefortheids.append({"ID": str(websocket.id), 
                                     "name": "nothing", 
                                    "mousepos" : {"x": 0, "y": 0}})
            


        print("client added to the database: ", websocket.id)
        print("num of clients: ", count)
    
    while True:
        try:
            
            # user sends us a message
            message = await websocket.recv()
            print("message from client: ", message, websocket.id)

            # getting the name
            newname = message.split('"') #name is the 3rd element
            print("the split: ", newname)

            xvalue = newname[8].replace(":", "")
            newx = xvalue.replace(",", '')
            

            yvalue = newname[10].replace(":", "")
            newy = yvalue.replace("}",'')
           
          
            template = {"name": newname[3], 
                        "mousepos" : {"x":int(newx), "y": int(newy)},
                        "socket": websocket}
            
            nosocktemp = {"name": newname[3], 
                        "mousepos" : {"x":int(newx), "y": int(newy)},
                        "ID": str(websocket.id)}

            
            

            # check if the dictionary is already in the array if not then we add it
            if not any(d["socket"] == websocket for d in clientName):
                clientName.append(template)
                storagewithoutsocket.append(nosocktemp)
                
                print("client added to the list")

            # adding message if its not in the table already and updating its values
            for d in clientName:
                if(d["socket"] == websocket):
                    d["name"] = template["name"]
                    d["mousepos"] = template["mousepos"]


                    
            for x in storagewithoutsocket:
                if(x["ID"] == str(websocket.id)):
                    x["name"] = template["name"]
                    x["mousepos"] = template["mousepos"]

                
            

            # sending the message
            for clients in clientList:
                if(clients != websocket):

                    y = json.dumps(storagewithoutsocket)
                    await clients.send(y)

        except ConnectionClosed:

            clientList.remove(websocket)
            defaults -= 1


            for x in clientName:
                if(x["socket"] == websocket):
                    clientName.remove(x)


            count -= 1
            print("num of clients (removed): ", count)
            print("client removed from list: ", websocket)
            break
        



async def main():
    print("server running ")
    async with serve(handler, "", 5174) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())