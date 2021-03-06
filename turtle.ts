import { rejects } from "assert";
import { S_IWUSR } from "constants";
import { Dir } from "fs";
import { JsonDB } from "node-json-db";
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
    inventory: Array<any>;

    constructor([x, y, z], dir, connection, world: World) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.dir = dir;
        this.connection = connection;
        this.world = world;
        this.inventory = new Array(16);

        //Get current label
        
        this.exec('os.getComputerLabel()').then((v) => {
            //Returns "" if no label
            var label = 'homie'
            if (v.result  == "") { //TODO: test this thing
                var sendLabel = {
                    "type":"label",
                    "msg": label
                }
                connection.send(JSON.stringify(sendLabel));
                this.label = label
            } else {
                this.label = v.result;
                //We know that we have been alive.
                //So we fetch the positions
                var rememberPosition = this.world.getTurtle(this);
                this.x = rememberPosition[0];
                this.y = rememberPosition[1];
                this.z = rememberPosition[2];
                this.dir = rememberPosition[3];
            }
            
            //After that's done get Inventory.
            this.getInventory();
        })
        //TODO: Make random label making
        /*
        var sendLabel = {
            "type":"label",
            "msg":"homie"
        }
        this.label = "homie"
        connection.send(JSON.stringify(sendLabel));
        */
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
        this.world.updateTurtle(this, this.x, this.y, this.z, this.dir);//also save everything important for restarting a turtle
        await this.inspectBlocks();
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
                //console.log(jsonParse);
                resolve(jsonParse);
            })
        })
    }
    //Runs the 3 turtle used commands to detect
    //blocks that are foward, up, and nodwn
    async inspectBlocks() {
        return new Promise(async(resolve, reject) => {
            //Wait for the last one to finish to be able
            //to send more.
            await this.exec("turtle.inspect()").then((v) => {
                //console.log("Forward: " + v.extra.name);
                var blockName = (v.result == "true") ? v.extra.name : "minecraft:air";
                //Compact forwardOffsets dependant on direction tell us where the block is relative to our direction.
                var forwardOffsetX = (this.dir == Direction.EAST) ? 1 : (this.dir == Direction.WEST) ? -1 : 0;
                var forwardOffsetZ = (this.dir == Direction.SOUTH) ? 1 : (this.dir == Direction.NORTH) ? -1 : 0;
                this.world.updateBlock(this.x + forwardOffsetX, this.y, this.z + forwardOffsetZ, blockName);
            })
            await this.exec("turtle.inspectUp()").then((v) => {
                var blockName = (v.result == "true") ? v.extra.name : "minecraft:air";
                this.world.updateBlock(this.x, this.y + 1, this.z, blockName);
            })
            await this.exec("turtle.inspectDown()").then((v) => {
                var blockName = (v.result == "true") ? v.extra.name : "minecraft:air";
                this.world.updateBlock(this.x, this.y - 1, this.z, blockName);
            })
            resolve("");
        });
    }

    //Updates the this.inventory array with that the turtle has
    async getInventory() {
        for(var i = 1; i < 17; i++) {
            //Select slot
            await this.exec("turtle.getItemDetail(" + i + ")").then((v) => {
                if (v.result == "true") {
                    this.inventory[i - 1] = v.extra;
                }
            });
        }
        //console.log(this.inventory);
    }

    async forward() { //The parent of all other functions basic that a turtle has.
        var result =  await this.exec("turtle.forward()");
        if (result.result == "true") {
            await this.UpdatePosition("forward");
        }
        return(result);
    }

    async back() {
        var result =  await this.exec("turtle.back()");
        if (result.result == "true") {
            await this.UpdatePosition("back");
        }
        return(result);
    }

    async up() {
        var result =  await this.exec("turtle.up()");
        if (result.result == "true") {
            await this.UpdatePosition("up");
        }
        return(result);
    }

    async down() {
        var result =  await this.exec("turtle.down()");
        if (result.result == "true") {
            await this.UpdatePosition("down");
        }
        return(result);
    }

    async turnLeft() {
        var result =  await this.exec("turtle.turnLeft()");
        if (result.result == "true") {
            await this.UpdatePosition("left");
        }
        return(result);
    }

    async turnRight() {
        var result =  await this.exec("turtle.turnRight()");
        if (result.result == "true") {
            await this.UpdatePosition("right");
        }
        return(result);
    }

    async dig() {
        var result =  await this.exec("turtle.dig()");
        if (result.result == "true") {
            await this.inspectBlocks(); //Block has been broken, update world.
        }
        await this.getInventory();
        return(result);
}
   
    async digUp() {
        var result =  await this.exec("turtle.digUp()");
        if (result.result == "true") {
            await this.inspectBlocks(); //Block has been broken, update world.
        }
        await this.getInventory();
        return(result);
}

    async digDown() {
        var result =  await this.exec("turtle.digDown()");
        if (result.result == "true") {
            await this.inspectBlocks(); //Block has been broken, update world.
        }
        await this.getInventory();
        return(result);
}
    
    //basic dig macro
    async digForward(distance: number) {
        for (var i = 0; i <= distance; i++) {
            await this.dig();//POV: CODE.org
            await this.forward();
            await this.turnLeft();
            await this.turnRight();
            await this.turnRight();
            await this.turnLeft();
        }
    }
    async moveForward(distance: number) {
        for (var i = 0; i < distance; i++) {
            var result = await this.forward();
            //console.log(result);
            if (result.result !== "true") {
                break;
            } //Continue walking forward if the last move foward was successful.
        }
    }
}

