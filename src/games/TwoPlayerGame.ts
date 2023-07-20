import { Game } from '../class/Game'
import { AdvancedSettings, PlayerSettings, SettingMetadata } from '../class/GameSettings'
import { TimeControl } from '../class/TimeControl'
import { PlayerClass } from '../class/Player'
import { Role } from '../types'

/**
 * Game containing two players.
 */
export class TwoPlayerGame<
    P extends PlayerSettings = PlayerSettings,
    A extends AdvancedSettings = AdvancedSettings,
    M extends SettingMetadata = SettingMetadata
> extends Game<P, A, M> {
    public static readonly ROLE_A = 'A'
    public static readonly ROLE_B = 'B'

    /**
     * Creates a two-player game.
     * @param timeControl The time control applied.
     * @param playerClass The player class.
     * @param roleList The list of roles.
     */
    constructor(
        protected readonly timeControl: TimeControl<P>,
        protected readonly playerClass: PlayerClass<P>,
        roleList: [Role, Role] = [TwoPlayerGame.ROLE_A, TwoPlayerGame.ROLE_B],
    ) {
        super(roleList, timeControl, playerClass)
    }
}