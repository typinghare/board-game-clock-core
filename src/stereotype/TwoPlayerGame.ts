import { TimeControl } from '../TimeControl'
import { Player } from '../Player'
import {
    GameSettings,
    PlayerAttributeProperties,
    PlayerAttributes,
    PlayerClass,
    TimeControlClass,
    TimeControlSettings,
} from '../types'
import { Game } from '../Game'

/**
 * Abstract two-player board game.
 * @author James Chan
 */
export abstract class TwoPlayerGame<
    G extends GameSettings = GameSettings,
    T extends TimeControl<TS> = TimeControl,
    P extends Player<T, TS, PA, PP> = Player<T>,
    TS extends TimeControlSettings = TimeControlSettings,
    PA extends PlayerAttributes = PlayerAttributes,
    PP extends PlayerAttributeProperties = PlayerAttributeProperties,
> extends Game<G, T, P, TS, PA, PP> {
    /**
     * Default role labels.
     * @private
     */
    private static DEFAULT_ROLE_ARRAY: string[] = ['A', 'B']

    /**
     * Creates a two-player board game.
     * @param timeControlClass - Class of creating a time control.
     * @param playerClass - Mapping of roles to players.
     * @protected
     */
    public constructor(timeControlClass: TimeControlClass<T>, playerClass: PlayerClass<T, P>) {
        super([...TwoPlayerGame.DEFAULT_ROLE_ARRAY], timeControlClass, playerClass)
    }
}