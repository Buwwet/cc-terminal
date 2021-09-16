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

const connections = [];
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
                        turtles.push({
                            turtle: new Turtle([0,0,0], 0, connection, world)
                        });
                        //var test = turtles[turtles.length - 1].turtle.forward();
                        //test.then((test2) => console.log(test2))
                        //console.log(turtles[0]);
                    }
                    
                }
            })
        }
        
        //Run the functions from the Turtle class
        if (messageParse.type == "eval") {
            eval("turtles[turtles.length - 1].turtle." + messageParse.msg).then(() => {
                var sendJSON = {
                    "type":"log",
                    "msg": turtles[turtles.length - 1].turtle.getJSON()
                }
                connection.send(JSON.stringify(sendJSON));
                //console.log(worldJSON);
                //Move this to world
                //connection.send(JSON.stringify(worldJSON));
            })
        }

        /*
        //Forward messages with the type eval to the computer
        if (messageParse.type == "eval") {
            turtles[turtles.length - 1].connection.send(JSON.stringify(messageParse));
        }
        
        /*
        connection.send(JSON.stringify({
            "type": "text",
            "msg": "Message recieved.",
            messageParse
        }))
        */
    })

})

function updateWorld() {
    connections.map((value, index) => {
        if (value.type == 'client') {
            var worldJSON = {
                "type":"world",
                "msg": turtles[turtles.length - 1].turtle.world.getJSON()
            }
            value.connection.send(JSON.stringify(worldJSON));
            var turtleJSON = {
                "type":"turtle",
                "msg": turtles[turtles.length - 1].turtle.getJSON(),
            }
            value.connection.send(JSON.stringify(turtleJSON));
        }
    })
}