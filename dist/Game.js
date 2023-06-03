"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameStatus = void 0;
const settings_1 = require("@typinghare/settings");
const RoleNotFoundException_1 = require("./exception/RoleNotFoundException");
var GameStatus;
(function (GameStatus) {
    // The game has been created but not started.
    GameStatus[GameStatus["PENDING"] = 0] = "PENDING";
    // The game has been started.
    GameStatus[GameStatus["STARTED"] = 1] = "STARTED";
    // The game has been paused.
    GameStatus[GameStatus["PAUSED"] = 2] = "PAUSED";
    // The game has stopped. Note that a stopped game cannot be resumed.
    GameStatus[GameStatus["STOPPED"] = 3] = "STOPPED";
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
     * @param roleArray - An array of role labels.
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
        this._timeControlClass = timeControlClass;
        this._playerClass = playerClass;
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
    toJsonObject() {
        const settings = {};
        for (const [name, setting] of Object.entries(this._settings.getSettings())) {
            // @ts-ignore
            settings[name] = setting.value;
        }
        const playerArray = [];
        for (const role of this._roleArray) {
            playerArray.push(this.getPlayer(role).toJsonObject());
        }
        return {
            settings,
            roleArray: this.roleArray,
            playerArray,
            gameStatus: this._gameStatus,
            timeUpRole: this._timeUpRole,
        };
    }
    fromJsonObject(jsonObject) {
        const { settings, roleArray, playerArray, gameStatus, timeUpRole } = jsonObject;
        for (const [name, settingValue] of Object.entries(settings)) {
            // @ts-ignore
            this._settings.getSetting(name).value = settingValue;
        }
        for (let i = 0; i < roleArray.length; i++) {
            const role = roleArray[i];
            this._roleArray[i] = roleArray[i];
            const player = new this._playerClass(role, this, new this._timeControlClass);
            player.fromJsonObject(playerArray[i]);
            this._playerMap.set(role, player);
        }
        this._gameStatus = gameStatus;
        this._timeUpRole = timeUpRole;
    }
}
exports.Game = Game;
