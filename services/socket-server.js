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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http = require("http");
var SocketServer = /** @class */ (function () {
    function SocketServer(port) {
        this.server = http.createServer();
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        this.users = new Map();
        this.initializeSocketHandlers();
    }
    SocketServer.prototype.initializeSocketHandlers = function () {
        var _this = this;
        this.io.on("connection", function (socket) {
            socket.on("set name", function (name) { return __awaiter(_this, void 0, void 0, function () {
                var existingUser;
                return __generator(this, function (_a) {
                    try {
                        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
                            throw new Error("Invalid username");
                        }
                        existingUser = Array.from(this.users.values()).find(function (user) { return user.name.toLowerCase() === name.toLowerCase(); });
                        if (existingUser) {
                            throw new Error("Username already taken");
                        }
                        this.users.set(socket.id, { id: socket.id, name: name });
                        this.io.emit("users list", Array.from(this.users.values()));
                    }
                    catch (error) {
                        socket.emit("error", {
                            message: "Failed to set username",
                            details: error === null || error === void 0 ? void 0 : error.message,
                        });
                    }
                    return [2 /*return*/];
                });
            }); });
            socket.on("chat message", function (data) { return __awaiter(_this, void 0, void 0, function () {
                var user;
                var _a;
                return __generator(this, function (_b) {
                    try {
                        user = this.users.get(socket.id);
                        if (!user) {
                            throw new Error("User not found");
                        }
                        if (!((_a = data === null || data === void 0 ? void 0 : data.message) === null || _a === void 0 ? void 0 : _a.trim())) {
                            throw new Error("Invalid message");
                        }
                        this.io.emit("chat message", {
                            userName: user.name,
                            userId: socket.id,
                            userMessage: data.message,
                            timestamp: new Date().toISOString(),
                        });
                    }
                    catch (error) {
                        socket.emit("error", {
                            message: "Failed to send message",
                            details: error === null || error === void 0 ? void 0 : error.message,
                        });
                    }
                    return [2 /*return*/];
                });
            }); });
            socket.on("disconnect", function () {
                _this.users.delete(socket.id);
                _this.io.emit("users list", Array.from(_this.users.values()));
            });
            socket.on("error", function (error) {
                console.error("Socket error:", error);
                socket.emit("error", {
                    message: "An unexpected error occurred",
                    details: "Please try again later",
                });
            });
        });
    };
    SocketServer.prototype.start = function () {
        var PORT = 3001;
        this.server.listen(PORT, function () {
            console.log("WebSocket server running on port ".concat(PORT));
        });
    };
    return SocketServer;
}());
var socketServer = new SocketServer(3001);
socketServer.start();
