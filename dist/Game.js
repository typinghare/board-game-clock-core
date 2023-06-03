"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameStatus = void 0;
const settings_1 = require("@typinghare/settings");
const RoleNotFoundException_1 = require("./exception/RoleNotFoundException");
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["PENDING"] = 0] = "PENDING";
    GameStatus[GameStatus["STARTED"] = 1] = "STARTED";
    GameStatus[GameStatus["STOPPED"] = 2] = "STOPPED";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
// noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
/**
 * Abstract board game. We simplify "board game" to "game" in this library because "board game" is too long.
 * @param <G> - Game settings.
 * @param <T> - Time control settings.
 * @param <P> - Player.
 * @param <TS> - Time control settings.
 * @param <PA> - Player attributes.
 * @param <PP> - Player attributes properties.
 * @author James Chan
 */
class Game {
    /**
     * Creates a board game.
     * @param roleArray - An array of roles.
     * @param timeControlClass - Class of creating a time control.
     * @param playerClass - Mapping of roles to players.
     * @protected
     */
    constructor(roleArray, timeControlClass, playerClass) {
        /**
         * Game settings.
         * @private
         */
        this._settings = new settings_1.SettingContainer();
        /**
         * Mapping of roles to players.
         * @private
         */
        this._playerMap = new Map();
        /**
         * Game status.
         * @private
         */
        this._gameStatus = GameStatus.PENDING;
        this._roleArray = roleArray;
        // Initialize players.
        for (const role of roleArray) {
            this._playerMap.set(role, new playerClass(role, this, new timeControlClass()));
        }
        // Initialize settings for this board game.
        this.initializeSettings();
    }
    /**
     * Initialize settings for this board game.
     * @protected
     */
    initializeSettings() {
    }
    /**
     * Returns this board game's settings.
     */
    get settings() {
        return this._settings;
    }
    /**
     * Returns the role array.
     */
    get roleArray() {
        return this._roleArray;
    }
    /**
     * Gets a player.
     * @param role the role of the player.
     */
    getPlayer(role) {
        if (!this._playerMap.has(role)) {
            throw new RoleNotFoundException_1.RoleNotFoundException(role);
        }
        return this._playerMap.get(role);
    }
    /**
     * Returns the next role.
     * @param role the current role.
     */
    getNextRole(role) {
        const roleIndex = this._roleArray.indexOf(role);
        if (roleIndex === -1) {
            throw new RoleNotFoundException_1.RoleNotFoundException(role);
        }
        return this._roleArray[(roleIndex + 1) % this._roleArray.length];
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the next player.
     * @param role the current role.
     */
    getNextPlayer(role) {
        return this.getPlayer(this.getNextRole(role));
    }
    /**
     * Starts this game.
     */
    start() {
        // Initialize clock controllers for all players.
        for (const player of this._playerMap.values()) {
            player.initializeClockController();
        }
        this._gameStatus = GameStatus.STARTED;
    }
    /**
     * Stops this game.
     */
    stop() {
        this._gameStatus = GameStatus.STOPPED;
        // Pause clock controllers for all players.
        for (const player of this._playerMap.values()) {
            player.clockController.pauseClock();
        }
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns game status.
     */
    get gameStatus() {
        return this._gameStatus;
    }
    /**
     * Sets time up callback function.
     * @param timeUpCallback
     */
    set clockTimeUpCallback(timeUpCallback) {
        this._clockTimeUpCallback = timeUpCallback;
    }
    /**
     * A specified role runs out of time.
     * @param role
     */
    timeUp(role) {
        var _a;
        this.getPlayer(role);
        this._timeUpRole = role;
        // Stop this board game.
        this.stop();
        // Invoke callback function.
        (_a = this._clockTimeUpCallback) === null || _a === void 0 ? void 0 : _a.call(this, role);
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns role that runs out of time; undefined if no role runs out of time.
     */
    get timeUpRole() {
        return this._timeUpRole;
    }
}
exports.Game = Game;
