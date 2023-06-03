"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoByoyomiClockController = exports.GoByoyomiPlayer = exports.GoByoyomiTimeControl = void 0;
const TimeControl_1 = require("../../TimeControl");
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
const ClockController_1 = require("../../ClockController");
const Clock_1 = require("../../Clock");
const Player_1 = require("../../Player");
class GoByoyomiTimeControl extends TimeControl_1.TimeControl {
    initializeSettings() {
        this.settings.addSetting('main', hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(10), {
            type: 'time',
            label: 'Main Time',
            description: 'The initial allotted time for a player to make moves without any additional constraints.',
            options: [
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(1),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(10),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(30),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(60),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(90),
            ],
        });
        this.settings.addSetting('timePerPeriod', hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(30), {
            type: 'time',
            label: 'Time/Period',
            description: 'The time given for each subsequent phase after the main time runs out is reduced by one ' +
                'period. If a player completes their moves within the time limit of a period, the number of periods ' +
                'remains the same and the time for the next period is reset for the next turn.',
            options: [
                hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(30),
                hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(40),
                hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(60),
            ],
        });
        this.settings.addSetting('periods', 3, {
            type: 'number',
            label: 'Periods',
            description: 'The number of periods. The clock will stop running when all the periods have been used up or consumed.',
            options: [1, 3, 5, 10],
        });
    }
}
exports.GoByoyomiTimeControl = GoByoyomiTimeControl;
class GoByoyomiPlayer extends Player_1.Player {
    createClockController() {
        return new GoByoyomiClockController(this);
    }
    updateAttributes() {
        const remainingPeriods = this.clockController.remainingPeriods;
        this._attributes.addSetting('remainingPeriods', remainingPeriods, { label: 'Remaining Periods' });
    }
}
exports.GoByoyomiPlayer = GoByoyomiPlayer;
class GoByoyomiClockController extends ClockController_1.ClockController {
    constructor() {
        super(...arguments);
        /**
         * Whether the player has enters byoyomi phase.
         * @private
         */
        this._isEnterByoyomi = false;
    }
    initializeClock() {
        const settings = this._timeControl.settings;
        const main = settings.getSetting('main').value;
        const timePerPeriod = settings.getSetting('timePerPeriod').value;
        this._remainingPeriods = settings.getSetting('periods').value;
        const clockController = this;
        return new Clock_1.Clock(main, function () {
            clockController._isEnterByoyomi = true;
            if (clockController._remainingPeriods > 1) {
                clockController._remainingPeriods--;
                return timePerPeriod;
            }
            else {
                clockController._player.timeUp();
                return undefined;
            }
        });
    }
    /**
     * Returns the remaining number of periods.
     */
    get remainingPeriods() {
        return this._remainingPeriods;
    }
}
exports.GoByoyomiClockController = GoByoyomiClockController;
