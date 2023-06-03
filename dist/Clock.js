"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
/**
 * Game clock. The time will be updated when being retrieved. When the time runs out, the clock will stop and invoke
 * the time up callback function.
 * @author James Chan
 */
class Clock {
    /**
     * Creates a clock.
     * @param initialTime initial time.
     * @param timeUpCallback the timestamp of the last updated time.
     */
    constructor(initialTime, timeUpCallback) {
        this._time = initialTime.clone();
        this._timeUpCallback = timeUpCallback;
    }
    toJsonObject() {
        return {
            isRunning: this.isRunning(),
            remainingTime: this.time.ms,
        };
    }
    fromJsonObject(jsonObject) {
        const { isRunning, remainingTime } = jsonObject;
        this._time = new hour_minute_second_1.SlowHourMinuteSecond(remainingTime);
        if (isRunning) {
            this.resume();
        }
    }
    /**
     * Sets time.
     * @param time time to set.
     */
    set time(time) {
        this._time = time.clone();
    }
    /**
     * Returns current time. Time will be updated before returning.
     */
    get time() {
        this.updateTime();
        return this._time.clone();
    }
    /**
     * Returns the prototype time.
     */
    get prototypeTime() {
        return this._time;
    }
    /**
     * Whether this clock is running.
     */
    isRunning() {
        return this._updatedTimestamp !== undefined;
    }
    /**
     * Updates the time.
     * @private
     */
    updateTime() {
        if (!this.isRunning())
            return;
        const currentTime = new Date().getTime();
        const difference = currentTime - this._updatedTimestamp;
        if (difference > 0) {
            this._time.consume(difference);
            this._updatedTimestamp = currentTime;
            if (this._time.ms <= 0) {
                this._time = hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(0);
                this.pause();
            }
        }
    }
    /**
     * Resumes this clock.
     */
    resume() {
        var _a;
        (_a = this._beforeResume) === null || _a === void 0 ? void 0 : _a.call(this);
        this._updatedTimestamp = new Date().getTime();
        this._timeoutHandle = setTimeout(() => {
            this.pause();
            const newTime = this._timeUpCallback.call(this);
            if (newTime !== undefined) {
                this.time = newTime;
                this.resume();
            }
        }, this._time.ms);
    }
    /**
     * Pauses this clock.
     */
    pause() {
        var _a;
        (_a = this._beforePause) === null || _a === void 0 ? void 0 : _a.call(this);
        // Subtracts time.
        if (this._updatedTimestamp) {
            this.updateTime();
            this._updatedTimestamp = undefined;
        }
        // Stops timeout handle.
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
            this._timeoutHandle = undefined;
        }
    }
    /**
     * Sets before resume callback function.
     * @param beforeResume
     */
    set beforeResume(beforeResume) {
        this._beforeResume = beforeResume;
    }
    /**
     * Sets before pause callback function.
     * @param beforePause
     */
    set beforePause(beforePause) {
        this._beforePause = beforePause;
    }
}
exports.Clock = Clock;
