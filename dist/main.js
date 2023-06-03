"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// main classes
__exportStar(require("./Clock"), exports);
__exportStar(require("./ClockController"), exports);
__exportStar(require("./Game"), exports);
__exportStar(require("./Player"), exports);
__exportStar(require("./TimeControl"), exports);
// types
__exportStar(require("./types"), exports);
// exceptions
__exportStar(require("./exception/RoleNotFoundException"), exports);
__exportStar(require("./exception/ClockControllerNotInitializedException"), exports);
// game
// 1. go
__exportStar(require("./game/go/GoGame"), exports);
__exportStar(require("./game/go/GoByoyomi"), exports);
__exportStar(require("./game/go/GoYingshi"), exports);
// 2. chess
__exportStar(require("./game/chess/ChessGame"), exports);
__exportStar(require("./game/chess/ChessStandard"), exports);
// stereotype
__exportStar(require("./stereotype/TwoPlayerGame"), exports);
