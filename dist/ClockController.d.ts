import { Clock } from './Clock';
import { HourMinuteSecond } from '@typinghare/hour-minute-second';
import { TimeControlSettings } from './types';
import { TimeControl } from './TimeControl';
import { Player } from './Player';
/**
 * Clock controller.
 * @param <TS> Time control settings.
 * @author James Chan
 */
export declare abstract class ClockController<TS extends TimeControlSettings = any> {
    /**
     * The player creating this clock controller.
     * @protected
     */
    protected readonly _player: Player;
    /**
     * Time control.
     * @protected
     */
    protected readonly _timeControl: TimeControl<TS>;
    /**
     * Clock.
     * @protected
     */
    protected readonly _clock: Clock;
    /**
     * Creates a clock controller.
     * @param player - The player creating this clock controller.
     */
    constructor(player: Player);
    /**
     * Initializes a clock.
     * @protected
     */
    protected abstract initializeClock(): Clock;
    /**
     * Whether the clock is running.
     */
    isClockRunning(): boolean;
    /**
     * Resumes the clock if the clock is not running.
     */
    resumeClock(): void;
    /**
     * Pauses the clock if the clock is running.
     */
    pauseClock(): void;
    /**
     * Returns the time of the clock.
     */
    get clockTime(): HourMinuteSecond;
}
