import { Clock } from './Clock'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import { JsonObjectEquivalent, TimeControlSettings } from './types'
import { TimeControl } from './TimeControl'
import { Player } from './Player'

/**
 * Abstract clock controller.
 * @param <TS> Time control settings.
 * @author James Chan
 */
export abstract class ClockController<TS extends TimeControlSettings = any> implements JsonObjectEquivalent<any> {
    /**
     * The player creating this clock controller.
     * @protected
     */
    protected readonly _player: Player

    /**
     * The time control.
     * @protected
     */
    protected readonly _timeControl: TimeControl<TS>

    /**
     * Clock.
     * @protected
     */
    protected readonly _clock: Clock

    /**
     * Creates a clock controller.
     * @param player - The player creating this clock controller.
     */
    public constructor(player: Player) {
        this._player = player
        this._timeControl = player.timeControl
        this._clock = this.initializeClock()
    }

    /**
     * Initializes the clock.
     * @protected
     */
    protected abstract initializeClock(): Clock;

    /**
     * Whether the clock is running.
     */
    isClockRunning(): boolean {
        return this._clock.isRunning()
    }

    /**
     * Resumes the clock if the clock is not running.
     */
    resumeClock(): void {
        this.isClockRunning() || this._clock.resume()
    }

    /**
     * Pauses the clock if the clock is running.
     */
    pauseClock(): void {
        this.isClockRunning() && this._clock.pause()
    }

    /**
     * Returns the time of the clock.
     */
    get clockTime(): HourMinuteSecond {
        return this._clock.time
    }

    fromJsonObject(jsonObject: any): void {
    }

    toJsonObject(): object {
        return {}
    }
}