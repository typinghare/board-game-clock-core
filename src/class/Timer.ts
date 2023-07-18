import { HourMinuteSecond, SlowHourMinuteSecond } from '@typinghare/hour-minute-second'

/**
 * Callback function fired when the timer ends.
 */
export type TimeEndCallback = (this: Timer) => void

/**
 * Callback function fired before the timer is resumed.
 */
export type BeforeResumeCallback = (this: Timer) => void

/**
 * Callback function fired before the timer is paused.
 */
export type BeforePauseCallback = (this: Timer) => void

/**
 * Timer. The time will be updated when being retrieved. When the timer ends, the timer will pause and invoke
 * the time end callback function.
 * @author James Chan
 */
export class Timer {
    /**
     * Remaining time.
     * @protected
     */
    protected internalTime: HourMinuteSecond

    /**
     * The timestamp of the last updated time.
     * @protected
     */
    protected lastUpdateTimestamp?: number

    /**
     * The handle of timeout.
     * @protected
     */
    protected timeoutHandle?: NodeJS.Timeout

    /**
     * Callback function fired before the timer is resumed.
     * @protected
     */
    protected beforeResumeCallback?: BeforeResumeCallback

    /**
     * Callback function fired before the timer is paused.
     * @protected
     */
    protected beforePauseCallback?: BeforePauseCallback

    /**
     * Creates a timer.
     * @param initialTime Initial time.
     * @param timeEndCallback Callback function fired when the timer ends.
     */
    constructor(
        protected readonly initialTime: HourMinuteSecond,
        protected readonly timeEndCallback: TimeEndCallback,
    ) {
        this.internalTime = initialTime.clone()
    }

    /**
     * Returns the time, which will be updated before being returned.
     */
    get time(): HourMinuteSecond {
        this.updateTime()
        return this.internalTime.clone()
    }

    /**
     * Sets time.
     * @param time time to set.
     */
    set time(time: HourMinuteSecond) {
        this.internalTime = time.clone()
    }

    /**
     * Sets before resume callback function.
     * @param beforeResumeCallback Callback function fired before the timer is resumed.
     */
    set onBeforeResume(beforeResumeCallback: BeforeResumeCallback | undefined) {
        this.beforeResumeCallback = beforeResumeCallback
    }

    /**
     * Sets before pause callback function.
     * @param beforePauseCallback Callback function fired before the timer is paused.
     */
    set onBeforePause(beforePauseCallback: BeforePauseCallback | undefined) {
        this.beforePauseCallback = beforePauseCallback
    }

    /**
     * Whether this timer is running.
     */
    isRunning(): boolean {
        return this.lastUpdateTimestamp !== undefined
    }

    /**
     * Resumes this timer.
     */
    resume(): void {
        this.beforeResumeCallback?.call(this)

        this.lastUpdateTimestamp = new Date().getTime()
        this.timeoutHandle = setTimeout(() => {
            this.pause()
            this.timeEndCallback.call(this)
        }, this.internalTime.ms)
    }

    /**
     * Pauses this timer.
     */
    pause(): void {
        this.beforePauseCallback?.call(this)

        if (this.lastUpdateTimestamp) {
            this.updateTime()
            this.lastUpdateTimestamp = undefined
        }

        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle)
            this.timeoutHandle = undefined
        }
    }

    /**
     * Returns the reference of the internal time variable.
     */
    protected getTimePrototype(): HourMinuteSecond {
        return this.internalTime
    }

    /**
     * Updates the time.
     * @private
     */
    protected updateTime(): void {
        if (this.lastUpdateTimestamp === undefined) return

        const currentTime = new Date().getTime()
        const difference = currentTime - this.lastUpdateTimestamp
        if (difference > 0) {
            this.internalTime.consume(difference)
            this.lastUpdateTimestamp = currentTime

            if (this.internalTime.ms <= 0) {
                this.internalTime = SlowHourMinuteSecond.ofSeconds(0)
                this.pause()
            }
        }
    }
}