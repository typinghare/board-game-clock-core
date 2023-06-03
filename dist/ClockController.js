"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockController = void 0;
/**
 * Clock controller.
 * @param <TS> Time control settings.
 * @author James Chan
 */
class ClockController {
    /**
     * Creates a clock controller.
     * @param player - The player creating this clock controller.
     */
    constructor(player) {
        this._player = player;
        this._timeControl = player.timeControl;
        this._clock = this.initializeClock();
    }
    /**
     * Whether the clock is running.
     */
    isClockRunning() {
        return this._clock.isRunning();
    }
    /**
     * Resumes the clock if the clock is not running.
     */
    resumeClock() {
        if (!this.isClockRunning()) {
            this._clock.resume();
        }
    }
    /**
     * Pauses the clock if the clock is running.
     */
    pauseClock() {
        if (this.isClockRunning()) {
            this._clock.pause();
        }
    }
    /**
     * Returns the time of the clock.
     */
    get clockTime() {
        return this._clock.time;
    }
}
exports.ClockController = ClockController;
