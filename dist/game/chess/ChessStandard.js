"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessStandardClockController = exports.ChessStandardPlayer = exports.ChessStandardTimeControl = void 0;
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
const Player_1 = require("../../Player");
const TimeControl_1 = require("../../TimeControl");
const ClockController_1 = require("../../ClockController");
const Clock_1 = require("../../Clock");
/**
 * Chess standard time control.
 * @author James Chan
 */
class ChessStandardTimeControl extends TimeControl_1.TimeControl {
    initializeSettings() {
        this.settings.addSetting('main', hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(30), {
            type: 'time',
            label: 'Main Time',
            description: 'The initial allotted time a player has to make their moves in a chess game without any ' +
                'additional time added after each move. It is the baseline time available for a player to consider ' +
                'their moves.',
            options: [
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(30),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(60),
                hour_minute_second_1.SlowHourMinuteSecond.ofMinutes(90),
            ],
        });
        this.settings.addSetting('timeIncrement', hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(20), {
            type: 'time',
            label: 'Time Increment',
            description: 'An additional amount of time added to a player\'s clock after each move. It provides a ' +
                'small increase in the available time for a player to make their moves, helping to prevent time ' +
                'pressure as each move grants a time boost.',
            options: [
                hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(20),
                hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(30),
                hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(40),
            ],
        });
    }
}
exports.ChessStandardTimeControl = ChessStandardTimeControl;
class ChessStandardPlayer extends Player_1.Player {
    createClockController() {
        return new ChessStandardClockController(this);
    }
    updateAttributes() {
        const usedTimeInRound = this.clockController.usedTimeInRound;
        this._attributes.addSetting('timeUsed', usedTimeInRound, {
            label: 'Used Time',
        });
    }
}
exports.ChessStandardPlayer = ChessStandardPlayer;
class ChessStandardClockController extends ClockController_1.ClockController {
    initializeClock() {
        const settings = this._timeControl.settings;
        const main = settings.getSetting('main').value;
        this._timeIncrement = settings.getSetting('timeIncrement').value;
        const clockController = this;
        const timeUpCallback = function () {
            clockController._player.timeUp();
            // clear before pause
            clock.beforePause = undefined;
            return undefined;
        };
        const clock = new Clock_1.Clock(main, timeUpCallback);
        clock.beforeResume = function () {
            clockController._resumedTime = this.time;
        };
        clock.beforePause = function () {
            try {
                const differenceInMs = clockController._resumedTime.ms - this.time.ms;
                if (differenceInMs > clockController._timeIncrement.ms) {
                    this.prototypeTime.extend(clockController._timeIncrement);
                }
            }
            catch (ignore) {
            }
            clockController._resumedTime = undefined;
        };
        return clock;
    }
    /**
     * Used time in seconds in this round.
     */
    get usedTimeInRound() {
        if (this._resumedTime === undefined)
            return 0;
        const currentTime = this._clock.time.ms;
        return Math.floor((this._resumedTime.ms - currentTime) / hour_minute_second_1.HourMinuteSecond.MILLISECONDS_IN_SECOND);
    }
}
exports.ChessStandardClockController = ChessStandardClockController;
