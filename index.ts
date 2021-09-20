const webSocketsServerPort = 8080;
const webSocketServer = require('websocket').server;
const http = require('http');

import {Turtle} from "./turtle";
import {World} from "./world";

const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port %d', webSocketsServerPort)

const wsServer = new webSocketServer({
    httpServer: server
})

var connections = [];
const turtles = [];

const world = new World(updateWorld);

wsServer.on('request', (request) => {
    //Could add ID system in the future
    console.log((new Date()) + ": Recieved a new connection.");

    const connection = request.accept();
    connections.push({
        connection: connection,
        type: "unknown"
    });

    //On message
    connection.on('message', (message) => {
        var messageParse = JSON.parse(message.utf8Data);

        //Assign client role.
        if (messageParse.type == "assign") {
            connections.map((client, i) => {
                if (client.connection == connection) {
                    //Sender client
                    client.type = messageParse.msg;
                    //Add it to the turtle array
                    if (client.type == "turtle") {
                        turtles.push(new Turtle([0,0,0], 0, connection, world));
                        //var test = turtles[turtles.length - 1].turtle.forward();
                        //test.then((test2) => console.log(test2))
                        //console.log(turtles[0]);
                    }
                    
                }
            })
        }
        
        //Run the functions from the Turtle class
        if (messageParse.type == "eval") {
            eval("turtles[turtles.length - 1]." + messageParse.msg).then(() => {
                var sendJSON = {
                    "type":"log",
                    "msg": turtles[turtles.length - 1].getJSON()
                }
                connection.send(JSON.stringify(sendJSON)); //Update the client with new turtle JSON
            })
        }
    })

    //When connection closes remove connection from list
    connection.on("close", (message) => {
        //console.log(connections);
        connections.map((value, i) => {
            if (value.connection == connection) {
                connections.splice(i, 1); //Remove connection from array
                //Splice does its thing on the array then it returns the values that were spliced.
                if (value.type == "turtle") { //If turtle map the turtles array and remove it too.
                        turtles.map((turtle, i) => {
                            if (turtle.connection == connection) {
                                turtles.splice(i, 1); //TODO: Check
                            }
                        })
                    }
                return;
            }
        })
        //console.log(connections);
    })

})

function updateWorld() { //This function is given to the world.ts World class. It runs it whenever we update the world.
    //console.log("worldJSON")
    connections.map((value, index) => {
        if (value.type == 'client') {
            var worldJSON = {
                "type":"world",
                "msg": turtles[turtles.length - 1].world.getJSON()
            }
            
            value.connection.send(JSON.stringify(worldJSON)); //Send the world
            
            const turtleJSONArray = turtles.map((turtle, i) => {
                return turtle.getJSON();
            })
            //console.log(turtleJSONArray);
            var turtleJSON = {
                "type":"turtle",
                "msg": JSON.stringify(turtleJSONArray),
            }
            value.connection.send(JSON.stringify(turtleJSON));
            var inventoryJSON = {
                "type":"log",
                "msg": turtles[turtles.length - 1].inventory
            }
            value.connection.send(JSON.stringify(inventoryJSON)); //Send the inventory
        }
    })
}