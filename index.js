"use strict";
exports.__esModule = true;
var webSocketsServerPort = 8080;
var webSocketServer = require('websocket').server;
var http = require('http');
var flatted_1 = require("flatted");
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
var world = new world_1.World();
wsServer.on('request', function (request) {
    //Could add ID system in the future
    console.log((new Date()) + ": Recieved a new connection.");
    var connection = request.accept();
    connections.push({
        connection: connection,
        type: "unknown"
    });
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
                        turtles.push({
                            turtle: new turtle_1.Turtle([0, 0, 0], 0, connection)
                        });
                        //var test = turtles[turtles.length - 1].turtle.forward();
                        //test.then((test2) => console.log(test2))
                        //console.log(turtles[0]);
                    }
                }
            });
        }
        //Run the functions from the Turtle class
        if (messageParse.type == "eval") {
            eval("turtles[turtles.length - 1].turtle." + messageParse.msg);
        }
        //Update the client on the turtle class
        connections.map(function (client, i) {
            if (turtles.length == 0) {
                return;
            }
            if (client.connection == connection && client.type == "client") {
                var sendArray = [];
                //sendArray.push(turtles[turtles.length - 1].turtle)
                connection.send((0, flatted_1.stringify)(turtles[turtles.length - 1].turtle));
            }
        });
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
    });
});
