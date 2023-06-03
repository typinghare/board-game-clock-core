"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoYingshiClockController = exports.GoYingshiPlayer = exports.GoYingshiTimeControl = void 0;
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
const TimeControl_1 = require("../../TimeControl");
const Player_1 = require("../../Player");
const ClockController_1 = require("../../ClockController");
const Clock_1 = require("../../Clock");
class GoYingshiTimeControl extends TimeControl_1.TimeControl {
    initializeSettings() {
        this.settings.addSetting('main', hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(30), {
            type: 'time',
            label: 'Main Time',
            description: 'The initial allotted time for a player to make moves without any additional constraints.',
            options: [
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(30),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(60),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(90),
            ],
        });
        this.settings.addSetting('penaltyTime', hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(20), {
            type: 'time',
            label: 'Penalty Time',
            description: 'The time of one penalty. Once the main time has elapsed, penalty time will be activated and used.',
            options: [
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(20),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(30),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(40),
            ],
        });
        this.settings.addSetting('maxPenalties', 2, {
            type: 'number',
            label: 'Max Penalties',
            description: 'The maximum number of penalties. The clock of a player stops when they have reached the ' +
                'maximum number of penalties.',
            options: [1, 2, 3],
        });
    }
}
exports.GoYingshiTimeControl = GoYingshiTimeControl;
class GoYingshiPlayer extends Player_1.Player {
    createClockController() {
        return new GoYingshiClockController(this);
    }
    updateAttributes() {
        const remainingPeriods = this.clockController.penaltiesUsed;
        this._attributes.addSetting('penaltiesUsed', remainingPeriods, { label: 'Penalties Used' });
    }
}
exports.GoYingshiPlayer = GoYingshiPlayer;
class GoYingshiClockController extends ClockController_1.ClockController {
    constructor() {
        super(...arguments);
        this._penaltiesUsed = 0;
    }
    initializeClock() {
        const settings = this._timeControl.settings;
        const main = settings.getSetting('main').value;
        const penaltyTime = settings.getSetting('penaltyTime').value;
        const maxPenalties = settings.getSetting('maxPenalties').value;
        const clockController = this;
        return new Clock_1.Clock(main, function () {
            if (clockController._penaltiesUsed < maxPenalties) {
                clockController._penaltiesUsed++;
                return penaltyTime;
            }
            else {
                clockController._player.timeUp();
                return undefined;
            }
        });
    }
    get penaltiesUsed() {
        return this._penaltiesUsed;
    }
}
exports.GoYingshiClockController = GoYingshiClockController;
