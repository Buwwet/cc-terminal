"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Turtle = void 0;
var Direction = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
};
var Turtle = /** @class */ (function () {
    function Turtle(_a, dir, connection, world) {
        var _this = this;
        var x = _a[0], y = _a[1], z = _a[2];
        this.x = x;
        this.y = y;
        this.z = z;
        this.dir = dir;
        this.connection = connection;
        this.world = world;
        this.inventory = new Array(16);
        //Get current label
        this.exec('os.getComputerLabel()').then(function (v) {
            //Returns "" if no label
            var label = 'homie';
            if (v.result == "") { //TODO: test this thing
                var sendLabel = {
                    "type": "label",
                    "msg": label
                };
                connection.send(JSON.stringify(sendLabel));
                _this.label = label;
            }
            else {
                _this.label = v.result;
                //We know that we have been alive.
                //So we fetch the positions
                var rememberPosition = _this.world.getTurtle(_this);
                _this.x = rememberPosition[0];
                _this.y = rememberPosition[1];
                _this.z = rememberPosition[2];
                _this.dir = rememberPosition[3];
            }
            //After that's done get Inventory.
            _this.getInventory();
        });
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
    Turtle.prototype.getJSON = function () {
        //Add inventory array in the future.
        var obj = {
            x: this.x,
            y: this.y,
            z: this.z,
            dir: this.dir,
            label: this.label
        };
        return obj;
    };
    //Update position.
    Turtle.prototype.UpdatePosition = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        switch (direction) {
                            case "up":
                                this.y++;
                                break;
                            case "down":
                                this.y--;
                                break;
                            case "right":
                                if (this.dir < Direction.WEST) {
                                    this.dir++;
                                }
                                else {
                                    this.dir = 0;
                                }
                                break;
                            case "left":
                                if (this.dir > Direction.NORTH) {
                                    this.dir--;
                                }
                                else {
                                    this.dir = 3;
                                }
                                break;
                            case "forward":
                                if (this.dir == Direction.NORTH) {
                                    this.z--;
                                }
                                if (this.dir == Direction.EAST) {
                                    this.x++;
                                }
                                if (this.dir == Direction.SOUTH) {
                                    this.z++;
                                }
                                if (this.dir == Direction.WEST) {
                                    this.x--;
                                }
                                break;
                            case "back":
                                if (this.dir == Direction.NORTH) {
                                    this.z++;
                                }
                                if (this.dir == Direction.EAST) {
                                    this.x--;
                                }
                                if (this.dir == Direction.SOUTH) {
                                    this.z--;
                                }
                                if (this.dir == Direction.WEST) {
                                    this.x++;
                                }
                                break;
                        }
                        //After we have changed positions, update our saved position in the world
                        this.world.updateTurtle(this, this.x, this.y, this.z, this.dir); //also save everything important for restarting a turtle
                        return [4 /*yield*/, this.inspectBlocks()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //Sends json to the turtle that it then runs.
    //waits for a response to know if it was successful
    Turtle.prototype.exec = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var sendJSON;
            var _this = this;
            return __generator(this, function (_a) {
                sendJSON = {
                    "type": "function",
                    "msg": "return " + command
                };
                this.connection.send(JSON.stringify(sendJSON));
                //Gives a promise that when solved says if the action was successful
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.connection.on('message', function (message) {
                            var jsonParse = JSON.parse(message.utf8Data);
                            //Get the response that we normaly get from the command.
                            //console.log(jsonParse);
                            resolve(jsonParse);
                        });
                    })];
            });
        });
    };
    //Runs the 3 turtle used commands to detect
    //blocks that are foward, up, and nodwn
    Turtle.prototype.inspectBlocks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                //Wait for the last one to finish to be able
                                //to send more.
                                return [4 /*yield*/, this.exec("turtle.inspect()").then(function (v) {
                                        //console.log("Forward: " + v.extra.name);
                                        var blockName = (v.result == "true") ? v.extra.name : "minecraft:air";
                                        //Compact forwardOffsets dependant on direction tell us where the block is relative to our direction.
                                        var forwardOffsetX = (_this.dir == Direction.EAST) ? 1 : (_this.dir == Direction.WEST) ? -1 : 0;
                                        var forwardOffsetZ = (_this.dir == Direction.SOUTH) ? 1 : (_this.dir == Direction.NORTH) ? -1 : 0;
                                        _this.world.updateBlock(_this.x + forwardOffsetX, _this.y, _this.z + forwardOffsetZ, blockName);
                                    })];
                                case 1:
                                    //Wait for the last one to finish to be able
                                    //to send more.
                                    _a.sent();
                                    return [4 /*yield*/, this.exec("turtle.inspectUp()").then(function (v) {
                                            var blockName = (v.result == "true") ? v.extra.name : "minecraft:air";
                                            _this.world.updateBlock(_this.x, _this.y + 1, _this.z, blockName);
                                        })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this.exec("turtle.inspectDown()").then(function (v) {
                                            var blockName = (v.result == "true") ? v.extra.name : "minecraft:air";
                                            _this.world.updateBlock(_this.x, _this.y - 1, _this.z, blockName);
                                        })];
                                case 3:
                                    _a.sent();
                                    resolve("");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    //Updates the this.inventory array with that the turtle has
    Turtle.prototype.getInventory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 1;
                        _a.label = 1;
                    case 1:
                        if (!(i < 17)) return [3 /*break*/, 4];
                        //Select slot
                        return [4 /*yield*/, this.exec("turtle.getItemDetail(" + i + ")").then(function (v) {
                                if (v.result == "true") {
                                    _this.inventory[i - 1] = v.extra;
                                }
                            })];
                    case 2:
                        //Select slot
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.forward = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.forward()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdatePosition("forward")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.back = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.back()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdatePosition("back")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.up()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdatePosition("up")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.down()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdatePosition("down")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.turnLeft = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.turnLeft()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdatePosition("left")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.turnRight = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.turnRight()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.UpdatePosition("right")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.dig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.dig()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.inspectBlocks()];
                    case 2:
                        _a.sent(); //Block has been broken, update world.
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getInventory()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.digUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.digUp()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.inspectBlocks()];
                    case 2:
                        _a.sent(); //Block has been broken, update world.
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getInventory()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, (result)];
                }
            });
        });
    };
    Turtle.prototype.digDown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exec("turtle.digDown()")];
                    case 1:
                        result = _a.sent();
                        if (!(result.result == "true")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.inspectBlocks()];
                    case 2:
                        _a.sent(); //Block has been broken, update world.
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.getInventory()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, (result)];
                }
            });
        });
    };
    //basic dig macro
    Turtle.prototype.digForward = function (distance) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i <= distance)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.dig()];
                    case 2:
                        _a.sent(); //POV: CODE.org
                        return [4 /*yield*/, this.forward()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.turnLeft()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.turnRight()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.turnRight()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.turnLeft()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Turtle.prototype.moveForward = function (distance) {
        return __awaiter(this, void 0, void 0, function () {
            var i, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < distance)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.forward()];
                    case 2:
                        result = _a.sent();
                        //console.log(result);
                        if (result.result !== "true") {
                            return [3 /*break*/, 4];
                        } //Continue walking forward if the last move foward was successful.
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Turtle;
}());
exports.Turtle = Turtle;
