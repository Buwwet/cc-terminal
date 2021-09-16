import { JsonDB } from "node-json-db";
import { Turtle } from "./turtle";

export class World {
    db: JsonDB;
    constructor() {
        this.db = new JsonDB('world.json');
    }

    updateTurtle(turtle: Turtle, x: number, y: number, z: number) {
        this.db.push(`/turtles/${turtle.label}`, [x, y, z])
    }

    getTurtle(turtle: Turtle): [number, number, number] {
        return this.db.getData(`/turtles/${turtle.label}`)
    }
    //DB is a json database
    updateBlock(x: number, y: number, z: number, block: any) {
        this.db.push(`/${x},${y},${z}`, block);
    }

    getBlock(x: number, y: number, z: number) {
        this.db.getData(`/${x},${y},${z}`);
    }
}