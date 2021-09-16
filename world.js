"use strict";
exports.__esModule = true;
exports.World = void 0;
var node_json_db_1 = require("node-json-db");
var World = /** @class */ (function () {
    function World() {
        this.db = new node_json_db_1.JsonDB('world.json');
    }
    World.prototype.updateTurtle = function (turtle, x, y, z) {
        this.db.push("/turtles/" + turtle.label, [x, y, z]);
    };
    World.prototype.getTurtle = function (turtle) {
        return this.db.getData("/turtles/" + turtle.label);
    };
    //DB is a json database
    World.prototype.updateBlock = function (x, y, z, block) {
        this.db.push("/" + x + "," + y + "," + z, block);
    };
    World.prototype.getBlock = function (x, y, z) {
        this.db.getData("/" + x + "," + y + "," + z);
    };
    return World;
}());
exports.World = World;
