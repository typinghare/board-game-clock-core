import { HourMinuteSecond } from '@typinghare/hour-minute-second';
import { TimeControl } from '../../TimeControl';
import { Player } from '../../Player';
import { ClockController } from '../../ClockController';
import { Clock } from '../../Clock';
export type GoYingshiTimeControlSettings = {
    main: HourMinuteSecond;
    penaltyTime: HourMinuteSecond;
    maxPenalties: number;
};
export type GoYingshiPlayerAttributes = {
    penaltiesUsed: number;
};
export declare class GoYingshiTimeControl extends TimeControl<GoYingshiTimeControlSettings> {
    protected initializeSettings(): void;
}
export declare class GoYingshiPlayer extends Player<GoYingshiTimeControl, GoYingshiTimeControlSettings, GoYingshiPlayerAttributes> {
    protected createClockController(): GoYingshiClockController;
    protected updateAttributes(): void;
}
export declare class GoYingshiClockController extends ClockController<GoYingshiTimeControlSettings> {
    private _penaltiesUsed;
    protected initializeClock(): Clock;
    get penaltiesUsed(): number;
}
