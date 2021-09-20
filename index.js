"use strict";
exports.__esModule = true;
var webSocketsServerPort = 8080;
var webSocketServer = require('websocket').server;
var http = require('http');
var turtle_1 = require("./turtle");
var world_1 = require("./world");
var server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port %d', webSocketsServerPort);
var wsServer = new webSocketServer({
    httpServer: server
});
var connections = [];
var turtles = [];
var world = new world_1.World(updateWorld);
wsServer.on('request', function (request) {
    //Could add ID system in the future
    console.log((new Date()) + ": Recieved a new connection.");
    var connection = request.accept();
    connections.push({
        connection: connection,
        type: "unknown"
    });
    //On message
    connection.on('message', function (message) {
        var messageParse = JSON.parse(message.utf8Data);
        //Assign client role.
        if (messageParse.type == "assign") {
            connections.map(function (client, i) {
                if (client.connection == connection) {
                    //Sender client
                    client.type = messageParse.msg;
                    //Add it to the turtle array
                    if (client.type == "turtle") {
                        turtles.push(new turtle_1.Turtle([0, 0, 0], 0, connection, world));
                        //var test = turtles[turtles.length - 1].turtle.forward();
                        //test.then((test2) => console.log(test2))
                        //console.log(turtles[0]);
                    }
                }
            });
        }
        //Run the functions from the Turtle class
        if (messageParse.type == "eval") {
            eval("turtles[turtles.length - 1]." + messageParse.msg).then(function () {
                var sendJSON = {
                    "type": "log",
                    "msg": turtles[turtles.length - 1].getJSON()
                };
                connection.send(JSON.stringify(sendJSON)); //Update the client with new turtle JSON
            });
        }
    });
    //When connection closes remove connection from list
    connection.on("close", function (message) {
        //console.log(connections);
        connections.map(function (value, i) {
            if (value.connection == connection) {
                connections.splice(i, 1); //Remove connection from array
                //Splice does its thing on the array then it returns the values that were spliced.
                if (value.type == "turtle") { //If turtle map the turtles array and remove it too.
                    turtles.map(function (turtle, i) {
                        if (turtle.connection == connection) {
                            turtles.splice(i, 1); //TODO: Check
                        }
                    });
                }
                return;
            }
        });
        //console.log(connections);
    });
});
function updateWorld() {
    //console.log("worldJSON")
    connections.map(function (value, index) {
        if (value.type == 'client') {
            var worldJSON = {
                "type": "world",
                "msg": turtles[turtles.length - 1].world.getJSON()
            };
            value.connection.send(JSON.stringify(worldJSON)); //Send the world
            var turtleJSONArray = turtles.map(function (turtle, i) {
                return turtle.getJSON();
            });
            //console.log(turtleJSONArray);
            var turtleJSON = {
                "type": "turtle",
                "msg": JSON.stringify(turtleJSONArray)
            };
            value.connection.send(JSON.stringify(turtleJSON));
            var inventoryJSON = {
                "type": "log",
                "msg": turtles[turtles.length - 1].inventory
            };
            value.connection.send(JSON.stringify(inventoryJSON)); //Send the inventory
        }
    });
}
