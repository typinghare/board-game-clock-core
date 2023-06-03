"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleNotFoundException = void 0;
class RoleNotFoundException extends Error {
    constructor(role) {
        super(`Role does not exist in the board game: [ ${role.toString()} ].`);
    }
}
exports.RoleNotFoundException = RoleNotFoundException;
