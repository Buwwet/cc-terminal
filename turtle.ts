import { rejects } from "assert";
import { S_IWUSR } from "constants";
import { Dir } from "fs";
import { JsonDB } from "node-json-db";
import { resolve } from "path/posix";
import { stringify } from "querystring";
import { json } from "stream/consumers";

import { World } from "./world";

const Direction = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
}

export class Turtle {
    //Turtle variables
    x: number;
    y: number;
    z: number;
    dir: number;
    connection: any;
    label: string;
    world: World;

    constructor([x, y, z], dir, connection, world: World) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.dir = dir;
        this.connection = connection;
        this.world = world;
        //TODO: Make random label making
        var sendLabel = {
            "type":"label",
            "msg":"homie"
        }
        this.label = "homie"
        connection.send(JSON.stringify(sendLabel));

        //test on startup:
        this.inspectBlocks();
    }

    //Get json for logging.
    getJSON(): Object {
        //Add inventory array in the future.
        const obj = {
            x: this.x,
            y: this.y,
            z: this.z,
            dir: this.dir,
            label: this.label,
        }
        return obj;
    }

    //Update position.
    async UpdatePosition(direction: string) {
        switch(direction) {
            case "up":
                this.y++
                break;
            case "down":
                this.y--
                break;
            case "right":
                if (this.dir < Direction.WEST) {
                    this.dir++;
                } else {
                    this.dir = 0;
                }
                break;
            case "left":
                if (this.dir > Direction.NORTH) {
                    this.dir--;
                } else {
                    this.dir = 3;
                }
                break;
            case "forward":
                if (this.dir == Direction.NORTH) {this.z--;}
                if (this.dir == Direction.EAST) {this.x++;}
                if (this.dir == Direction.SOUTH) {this.z++;}
                if (this.dir == Direction.WEST) {this.x--;}
                break;
            case "back":
                if (this.dir == Direction.NORTH) {this.z++;}
                if (this.dir == Direction.EAST) {this.x--;}
                if (this.dir == Direction.SOUTH) {this.z--;}
                if (this.dir == Direction.WEST) {this.x++;}
                break;
        }
        //After we have changed positions, update our saved position in the world
        this.inspectBlocks();
        this.world.updateTurtle(this, this.x, this.y, this.z);
    }

    //Sends json to the turtle that it then runs.
    //waits for a response to know if it was successful
    async exec<T>(command: string): Promise<any> {
        var sendJSON = {
            "type":"function",
            "msg": "return " + command
        }
        this.connection.send(JSON.stringify(sendJSON));
        //Gives a promise that when solved says if the action was successful
        return new Promise((resolve, reject) => {
            this.connection.on('message', message => {
                var jsonParse = JSON.parse(message.utf8Data);
                //Get the response that we normaly get from the command.
                var isTrueSet = (jsonParse.result === 'true')
                jsonParse.result = isTrueSet; //so that we dont have to make 7 if statements.
                //console.log(jsonParse);
                resolve(jsonParse);
            })
        })
    }
    //Runs the 3 turtle used commands to detect
    //blocks that are foward, up, and nodwn
    async inspectBlocks() {
        //Wait for the last one to finish to be able
        //to send more.
        await this.exec("turtle.inspect()").then((v) => {
            //console.log("Forward: " + v.extra.name);
            var blockName = (v.result) ? v.extra.name : "minecraft:air";
            //Compact forwardOffsets dependant on direction
            var forwardOffsetX = (this.dir == Direction.EAST) ? 1 : (this.dir == Direction.WEST) ? -1 : 0;
            var forwardOffsetY = (this.dir == Direction.SOUTH) ? 1 : (this.dir == Direction.NORTH) ? -1 : 0;
            this.world.updateBlock(this.x + forwardOffsetX, this.y, this.z + forwardOffsetY, blockName);
        })
        await this.exec("turtle.inspectUp()").then((v) => {
            var blockName = (v.result) ? v.extra.name : "minecraft:air";
            this.world.updateBlock(this.x, this.y + 1, this.z, blockName);
        })
        await this.exec("turtle.inspectDown()").then((v) => {
            var blockName = (v.result) ? v.extra.name : "minecraft:air";
            this.world.updateBlock(this.x, this.y - 1, this.z, blockName);
        })
    }

    async forward() {
        return new Promise((resolve, reject) => {
            this.exec("turtle.forward()").then((v) => {
                if (v.result === true) {
                    //DO stuff here
                    this.UpdatePosition("forward");
                }
                resolve(v);
            })
        })
    }

    async back() {
        return new Promise((resolve, reject) => {
            this.exec("turtle.back()").then((v) => {
                if (v.result === true) {
                    //DO stuff here
                    this.UpdatePosition("back");
                }
                resolve(v);
            })
        })
    }

    async up() {
        return new Promise((resolve, reject) => {
            this.exec("turtle.up()").then((v) => {
                if (v.result === true) {
                    //DO stuff here
                    this.UpdatePosition("up");
                }
                resolve(v);
            })
        })
    }

    async down() {
        return new Promise((resolve, reject) => {
            this.exec("turtle.down()").then((v) => {
                if (v.result === true) {
                    //DO stuff here
                    this.UpdatePosition("down");
                }
                resolve(v);
            })
        })
    }

    async turnLeft() {
        return new Promise((resolve, reject) => {
            this.exec("turtle.turnLeft()").then((v) => {
                if (v.result === true) {
                    //DO stuff here
                    this.UpdatePosition("left");
                }
                resolve(v);
            })
        })
    }

    async turnRight() {
        return new Promise((resolve, reject) => {
            this.exec("turtle.turnRight()").then((v) => {
                if (v.result === true) {
                    //DO stuff here
                    this.UpdatePosition("right");
                }
                resolve(v);
            })
        })
    }
   
}

