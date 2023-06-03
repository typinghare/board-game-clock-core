"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockControllerNotInitializedException = void 0;
class ClockControllerNotInitializedException extends Error {
    constructor() {
        super('The clock controller has not been initialized.');
    }
}
exports.ClockControllerNotInitializedException = ClockControllerNotInitializedException;
