import { TimeControl } from '../../TimeControl';
import { Player } from '../../Player';
import { GameSupplierMap, GameTimeControl, PlayerAttributeProperties, PlayerAttributes, TimeControlSettings } from '../../types';
import { TwoPlayerGame } from '../../stereotype/TwoPlayerGame';
export type ChessGameSettings = {
    sync: boolean;
};
export declare class ChessGame<T extends TimeControl<TS>, P extends Player<T, TS, PA, PP>, TS extends TimeControlSettings = any, PA extends PlayerAttributes = any, PP extends PlayerAttributeProperties = any> extends TwoPlayerGame<ChessGameSettings, T, P, TS, PA, PP> {
    initializeSettings(): void;
}
export type ChessGameTimeControlType = 'Standard';
export declare const ChessGameTimeControl: GameTimeControl<ChessGameTimeControlType>;
export declare const ChessGameSupplierMap: GameSupplierMap<ChessGameTimeControlType>;
