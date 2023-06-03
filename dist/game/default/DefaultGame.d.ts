import { TimeControl } from '../../TimeControl';
import { Player } from '../../Player';
import { ClockController } from '../../ClockController';
import { Clock } from '../../Clock';
import { HourMinuteSecond } from '@typinghare/hour-minute-second';
import { TwoPlayerGame } from '../../stereotype/TwoPlayerGame';
import { GameSettings } from '../../types';
export type DefaultGameSettings = GameSettings & {};
export type DefaultPlayerAttributes = {
    isRunning: boolean;
};
export type DefaultTimeControlSettings = {
    main: HourMinuteSecond;
};
export declare class DefaultGame extends TwoPlayerGame<DefaultGameSettings, DefaultTimeControl, DefaultPlayer> {
    constructor();
}
export declare class DefaultPlayer extends Player<DefaultTimeControl, DefaultTimeControlSettings, DefaultPlayerAttributes> {
    protected createClockController(): DefaultClockController;
    protected updateAttributes(): void;
}
export declare class DefaultTimeControl extends TimeControl<DefaultTimeControlSettings> {
    protected initializeSettings(): void;
}
export declare class DefaultClockController extends ClockController<DefaultTimeControlSettings> {
    protected initializeClock(): Clock;
}
