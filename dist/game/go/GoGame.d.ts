import { GameSettings, GameSupplierMap, GameTimeControl, PlayerAttributeProperties, PlayerAttributes, TimeControlSettings } from '../../types';
import { TimeControl } from '../../TimeControl';
import { Player } from '../../Player';
import { TwoPlayerGame } from '../../stereotype/TwoPlayerGame';
export type GoGameSettings = GameSettings & {
    sync: boolean;
};
export declare class GoGame<T extends TimeControl<TS>, P extends Player<T, TS, PA, PP>, TS extends TimeControlSettings = any, PA extends PlayerAttributes = any, PP extends PlayerAttributeProperties = any> extends TwoPlayerGame<GoGameSettings, T, P, TS, PA, PP> {
    protected initializeSettings(): void;
}
export type GoGameTimeControlType = 'Byoyomi' | 'Yingshi';
export declare const GoGameTimeControl: GameTimeControl<GoGameTimeControlType>;
export declare const GoGameSupplierMap: GameSupplierMap<GoGameTimeControlType>;
