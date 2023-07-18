import { Player, PlayerClass } from './Player'
import { Role } from '../types'
import { TimeControl } from './TimeControl'
import { AdvancedSettings, GameSettings, PlayerSettings, SettingMetadata } from './GameSettings'
import { DataCollection, DataMapping } from '@typinghare/extrum'

/**
 * Callback function fired when the game stops.
 */
export type StopCallback<R extends Role> = (stopperRole: R | undefined, timeUpRole: R | undefined) => {}

/**
 * Game status.
 */
export enum GameStatus {
    PENDING = 0,    // The game has been created but not started.
    STARTED = 1,    // The game has been started.
    PAUSED = 2,     // The game has been paused.
    STOPPED = 3     // The game has stopped. Note that a stopped game cannot be resumed.
}

/**
 * Abstract board game. We simplify "board game" to "game" in this library because "board game" is too long.
 * @param <G> - Game settings.
 */
export class Game<
    R extends Role = Role,
    P extends PlayerSettings = PlayerSettings,
    A extends AdvancedSettings = AdvancedSettings,
    M extends SettingMetadata = SettingMetadata
> {
    /**
     * The settings of this game.
     * @protected
     */
    protected readonly gameSettings: GameSettings<R, P, A, M>

    /**
     * The map of players.
     * @protected
     */
    protected readonly playerMap: Map<R, Player> = new Map()

    /**
     * The status of this game.
     * @protected
     */
    protected gameStatus: GameStatus = GameStatus.PENDING

    /**
     * Callback function fired when the game stops.
     * @protected
     */
    protected stopCallback?: StopCallback<Role>

    /**
     * Creates a game.
     * @param roleArray The array of roles.
     * @param timeControl The time control applied.
     * @param playerClass The player class.
     */
    constructor(
        protected readonly roleArray: R[],
        protected readonly timeControl: TimeControl<P>,
        protected readonly playerClass: PlayerClass,
    ) {
        // Initialize players
        this.playerMap = new Map()
        roleArray.forEach(role => {
            this.playerMap.set(role, new playerClass(this, role))
        })

        // Create game settings
        this.gameSettings = new GameSettings<R, P, A, M>(this, timeControl)
    }

    /**
     * Sets the stop callback function.
     * @param stopCallback Callback function fired when the game stops.
     */
    set onStop(stopCallback: StopCallback<Role>) {
        this.stopCallback = stopCallback
    }

    /**
     * Returns the role array.
     */
    getRoleArray(): R[] {
        return this.roleArray
    }

    /**
     * Returns the index of a role.
     * @param role The role of the index.
     * @throws Error if the role does not exist.
     */
    getRoleIndex(role: R): number {
        const index = this.roleArray.indexOf(role)
        if (index === -1) {
            throw new Error('The role does not exist.')
        }

        return index
    }

    /**
     * Returns a player by specified role.
     * @param role The role of the specified player.
     */
    getPlayer(role: R): Player {
        return this.playerMap.get(role)!
    }

    /**
     * Returns the index of the next role.
     * @param role The current role.
     */
    getNextIndex(role: R): number {
        return (this.getRoleIndex(role) + 1) % this.roleArray.length
    }

    /**
     * Returns the next role.
     * @param role The current role.
     */
    getNextRole(role: R): R {
        return this.roleArray[this.getNextIndex(role)]
    }

    /**
     * Returns the next player.
     * @param role
     */
    getNextPlayer(role: R): Player {
        return this.getPlayer(this.getNextRole(role))
    }

    /**
     * Starts this game.
     */
    start(): void {
        this.gameStatus = GameStatus.STARTED
    }

    /**
     * Pauses this game.
     */
    pause(): void {
        this.gameStatus = GameStatus.PAUSED
    }

    /**
     * Resumes this game.
     */
    resume(): void {
        this.gameStatus = GameStatus.STARTED
    }

    /**
     * Stops this game.
     * @param stopperRole The role of the player who stops the game
     * @param timeUpRole The role of the player whose time has been run out
     */
    stop(stopperRole?: R | undefined, timeUpRole?: R | undefined): void {
        this.gameStatus = GameStatus.STOPPED

        // Fire stop callback function
        if (this.stopCallback) {
            this.stopCallback(stopperRole, timeUpRole)
        }
    }

    /**
     * Returns game settings.
     */
    getGameSettings(): GameSettings<R, P, A, M> {
        return this.gameSettings
    }

    /**
     * Initializes advanced game settings.
     */
    initializeAdvancedSettings(): DataCollection<A> {
        return new DataCollection({} as DataMapping<A>)
    }
}