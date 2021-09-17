import { JsonDB } from "node-json-db";
import { Turtle } from "./turtle";

export class World {
    db: JsonDB;
    onChange: Function;
    constructor(onChange: Function) {
        this.db = new JsonDB('world.json');
        this.onChange = onChange;
    }

    updateTurtle(turtle: Turtle, x: number, y: number, z: number, dir: number) {
        this.db.push(`/turtles/${turtle.label}`, [x, y, z, dir])
    }

    getTurtle(turtle: Turtle): [number, number, number, number] {
        return this.db.getData(`/turtles/${turtle.label}`)
    }
    //DB is a json database
    updateBlock(x: number, y: number, z: number, block: any) {
        this.db.push(`/${x},${y},${z}`, block);
        this.onChange();
    }

    getBlock(x: number, y: number, z: number) {
        this.db.getData(`/${x},${y},${z}`);
    }

    getJSON(): any {
        return this.db.getData("/");
    }
}