"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeControl = void 0;
const settings_1 = require("@typinghare/settings");
/**
 * Abstract time control.
 * @param <TS> - Time control settings.
 * @author James Chan
 */
class TimeControl {
    /**
     * Returns this time control's settings.
     */
    get settings() {
        return this._settings;
    }
    /**
     * Creates a time control.
     * @protected
     */
    constructor() {
        /**
         * Time control settings.
         * @private
         */
        this._settings = new settings_1.SettingContainer();
        this.initializeSettings();
    }
    /**
     * Initializes settings for this time control.
     * @protected
     */
    initializeSettings() {
    }
}
exports.TimeControl = TimeControl;
