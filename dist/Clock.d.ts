import { HourMinuteSecond } from '@typinghare/hour-minute-second';
/**
 * A callback function being invoked when the clock's time runs out. If the return value is HourMinuteSecond, it will
 * be set to be the new time, and the clock continues.
 */
export type TimeUpCallback = (this: Clock) => HourMinuteSecond | undefined;
/**
 * A callback function being invoked before the clock is resume.
 */
export type BeforeResume = (this: Clock) => void;
/**
 * A callback function being invoked after the clock is paused.
 */
export type BeforePause = (this: Clock) => void;
/**
 * Game clock. The time will be updated when being retrieved. When the time runs out, the clock will stop and invoke
 * the time up callback function.
 * @author James Chan
 */
export declare class Clock {
    /**
     * Remaining time.
     * @private
     */
    private _time;
    /**
     * The time up callback function.
     * @private
     */
    private readonly _timeUpCallback;
    /**
     * The timestamp of the last updated time.
     * @private
     */
    private _updatedTimestamp?;
    /**
     * Timeout handle.
     * @private
     */
    private _timeoutHandle?;
    private _beforeResume?;
    private _beforePause?;
    /**
     * Creates a clock.
     * @param initialTime initial time.
     * @param timeUpCallback the timestamp of the last updated time.
     */
    constructor(initialTime: HourMinuteSecond, timeUpCallback: TimeUpCallback);
    /**
     * Sets time.
     * @param time time to set.
     */
    set time(time: HourMinuteSecond);
    /**
     * Returns current time. Time will be updated before returning.
     */
    get time(): HourMinuteSecond;
    /**
     * Returns the prototype time.
     */
    get prototypeTime(): HourMinuteSecond;
    /**
     * Whether this clock is running.
     */
    isRunning(): boolean;
    /**
     * Updates the time.
     * @private
     */
    private updateTime;
    /**
     * Resumes this clock.
     */
    resume(): void;
    /**
     * Pauses this clock.
     */
    pause(): void;
    /**
     * Sets before resume call back function.
     * @param beforeResume
     */
    set beforeResume(beforeResume: BeforeResume | undefined);
    /**
     * Sets before pause callback function.
     * @param beforePause
     */
    set beforePause(beforePause: BeforePause | undefined);
}
