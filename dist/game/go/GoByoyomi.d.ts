import { TimeControl } from '../../TimeControl';
import { HourMinuteSecond } from '@typinghare/hour-minute-second';
import { ClockController } from '../../ClockController';
import { Clock } from '../../Clock';
import { Player } from '../../Player';
export type GoByoyomiTimeControlSettings = {
    main: HourMinuteSecond;
    timePerPeriod: HourMinuteSecond;
    periods: number;
};
export type GoByoyomiPlayerAttributes = {
    remainingPeriods: number;
};
export declare class GoByoyomiTimeControl extends TimeControl<GoByoyomiTimeControlSettings> {
    protected initializeSettings(): void;
}
export declare class GoByoyomiPlayer extends Player<GoByoyomiTimeControl, GoByoyomiTimeControlSettings, GoByoyomiPlayerAttributes> {
    protected createClockController(): GoByoyomiClockController;
    protected updateAttributes(): void;
}
export declare class GoByoyomiClockController extends ClockController<GoByoyomiTimeControlSettings> {
    /**
     * The remaining number of periods.
     * @private
     */
    private _remainingPeriods?;
    /**
     * Whether the player has enters byoyomi phase.
     * @private
     */
    private _isEnterByoyomi;
    protected initializeClock(): Clock;
    /**
     * Returns the remaining number of periods.
     */
    get remainingPeriods(): number;
}
