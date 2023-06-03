"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const settings_1 = require("@typinghare/settings");
const ClockControllerNotInitializedException_1 = require("./exception/ClockControllerNotInitializedException");
/**
 * Abstract board game player.
 * @param <T> - Time control settings.
 * @param <TS> - Time control settings.
 * @param <PA> - Player attributes.
 * @param <PP> - Player attributes properties.
 * @author James Chan
 */
class Player {
    /**
     * Creates a player.
     * @param role - The role of this player.
     * @param game - The game creating this player.
     * @param timeControl
     */
    constructor(role, game, timeControl) {
        /**
         * Player attributes.
         * @private
         */
        this._attributes = new settings_1.SettingContainer();
        this._role = role;
        this._game = game;
        this._timeControl = timeControl;
    }
    /**
     * Updates attributes.
     * @protected
     */
    updateAttributes() {
    }
    /**
     * Player clicks the screen.
     */
    click() {
        // Pauses this player's clock.
        this.clockController.pauseClock();
        // Resumes next player's clock.
        const nextRole = this._game.getNextRole(this._role);
        this._game.getPlayer(nextRole).clockController.resumeClock();
    }
    /**
     * Return this player's attributes.
     */
    get attributes() {
        this.updateAttributes();
        return this._attributes;
    }
    /**
     * Return time control.
     */
    get timeControl() {
        return this._timeControl;
    }
    get clockController() {
        if (this._clockController === undefined) {
            throw new ClockControllerNotInitializedException_1.ClockControllerNotInitializedException();
        }
        return this._clockController;
    }
    /**
     * This player runs out of time.
     */
    timeUp() {
        this._game.timeUp(this._role);
    }
    /**
     * Initialize controller.
     */
    initializeClockController() {
        this._clockController = this.createClockController();
    }
    toJsonObject() {
        var _a;
        return {
            timeControl: this._timeControl.toJsonObject(),
            clockController: (_a = this._clockController) === null || _a === void 0 ? void 0 : _a.toJsonObject(),
        };
    }
    fromJsonObject(jsonObject) {
        var _a;
        const { timeControl, clockController } = jsonObject;
        this._timeControl.fromJsonObject(timeControl);
        if (clockController) {
            (_a = this._clockController) === null || _a === void 0 ? void 0 : _a.fromJsonObject(clockController);
        }
    }
}
exports.Player = Player;
