"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultClockController = exports.DefaultTimeControl = exports.DefaultPlayer = exports.DefaultGame = void 0;
const TimeControl_1 = require("../../TimeControl");
const Player_1 = require("../../Player");
const ClockController_1 = require("../../ClockController");
const Clock_1 = require("../../Clock");
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
const TwoPlayerGame_1 = require("../../stereotype/TwoPlayerGame");
class DefaultGame extends TwoPlayerGame_1.TwoPlayerGame {
    constructor() {
        super(DefaultTimeControl, DefaultPlayer);
    }
}
exports.DefaultGame = DefaultGame;
class DefaultPlayer extends Player_1.Player {
    createClockController() {
        return new DefaultClockController(this);
    }
    updateAttributes() {
        this._attributes.addSetting('isRunning', this.clockController.isClockRunning(), { label: 'Running' });
    }
}
exports.DefaultPlayer = DefaultPlayer;
class DefaultTimeControl extends TimeControl_1.TimeControl {
    initializeSettings() {
        this.settings.addSetting('main', hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(15));
    }
}
exports.DefaultTimeControl = DefaultTimeControl;
class DefaultClockController extends ClockController_1.ClockController {
    initializeClock() {
        const settings = this._timeControl.settings;
        const main = settings.getSetting('main').value;
        return new Clock_1.Clock(main, () => {
            this._player.timeUp();
            return undefined;
        });
    }
}
exports.DefaultClockController = DefaultClockController;
