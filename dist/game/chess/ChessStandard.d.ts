import { HourMinuteSecond } from '@typinghare/hour-minute-second';
import { Player } from '../../Player';
import { TimeControl } from '../../TimeControl';
import { ClockController } from '../../ClockController';
import { Clock } from '../../Clock';
export type ChessStandardTimeControlSettings = {
    main: HourMinuteSecond;
    timeIncrement: HourMinuteSecond;
};
export type ChessStandardPlayerAttributes = {
    timeUsed: number;
};
/**
 * Chess standard time control.
 * @author James Chan
 */
export declare class ChessStandardTimeControl extends TimeControl<ChessStandardTimeControlSettings> {
    protected initializeSettings(): void;
}
export declare class ChessStandardPlayer extends Player<ChessStandardTimeControl, ChessStandardTimeControlSettings, ChessStandardPlayerAttributes> {
    protected createClockController(): ChessStandardClockController;
    protected updateAttributes(): void;
}
export declare class ChessStandardClockController extends ClockController<ChessStandardTimeControlSettings> {
    private _resumedTime?;
    private _timeIncrement?;
    protected initializeClock(): Clock;
    /**
     * Used time in seconds in this round.
     */
    get usedTimeInRound(): number;
}
