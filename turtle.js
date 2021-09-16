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
    function Turtle(_a, dir, connection) {
        var x = _a[0], y = _a[1], z = _a[2];
        this.x = x;
        this.y = y;
        this.z = z;
        this.dir = dir;
        this.connection = connection;
        //Make random label making
        var sendLabel = {
            "type": "label",
            "msg": "homie"
        };
        connection.send(JSON.stringify(sendLabel));
    }
    //Update position.
    Turtle.prototype.UpdatePosition = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
                            this.dir = 4;
                        }
                        break;
                    case "forwards":
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
                return [2 /*return*/];
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
                            var isTrueSet = (jsonParse.msg === 'true');
                            resolve(isTrueSet);
                        });
                    })];
            });
        });
    };
    Turtle.prototype.forward = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.exec("turtle.forward()").then(function (v) {
                            if (v === true) {
                                //DO stuff here
                                _this.UpdatePosition("forward");
                            }
                            resolve(v);
                        });
                    })];
            });
        });
    };
    Turtle.prototype.back = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.exec("turtle.back()").then(function (v) {
                            if (v === true) {
                                //DO stuff here
                                _this.UpdatePosition("back");
                            }
                            resolve(v);
                        });
                    })];
            });
        });
    };
    Turtle.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.exec("turtle.up()").then(function (v) {
                            if (v === true) {
                                //DO stuff here
                                _this.UpdatePosition("up");
                            }
                            resolve(v);
                        });
                    })];
            });
        });
    };
    Turtle.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.exec("turtle.down()").then(function (v) {
                            if (v === true) {
                                //DO stuff here
                                _this.UpdatePosition("down");
                            }
                            resolve(v);
                        });
                    })];
            });
        });
    };
    Turtle.prototype.turnLeft = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.exec("turtle.turnLeft()").then(function (v) {
                            if (v === true) {
                                //DO stuff here
                                _this.UpdatePosition("left");
                            }
                            resolve(v);
                        });
                    })];
            });
        });
    };
    Turtle.prototype.turnRight = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.exec("turtle.turnRight()").then(function (v) {
                            if (v === true) {
                                //DO stuff here
                                _this.UpdatePosition("right");
                            }
                            resolve(v);
                        });
                    })];
            });
        });
    };
    return Turtle;
}());
exports.Turtle = Turtle;
