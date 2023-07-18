import { Game } from '../class/Game'
import { AdvancedSettings, PlayerSettings, SettingMetadata } from '../class/GameSettings'
import { TimeControl } from '../class/TimeControl'
import { PlayerClass } from '../class/Player'

export class TwoPlayerGame<
    P extends PlayerSettings = PlayerSettings,
    A extends AdvancedSettings = AdvancedSettings,
    M extends SettingMetadata = SettingMetadata
> extends Game<'A' | 'B', P, A, M> {
    public static readonly ROLE_A = 'A'
    public static readonly ROLE_B = 'B'

    /**
     * Creates a two-player game.
     * @param timeControl The time control applied.
     * @param playerClass The player class.
     */
    constructor(
        protected readonly timeControl: TimeControl<P>,
        protected readonly playerClass: PlayerClass,
    ) {
        super([TwoPlayerGame.ROLE_A, TwoPlayerGame.ROLE_B], timeControl, playerClass)
    }
}