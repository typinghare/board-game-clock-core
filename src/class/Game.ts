import { Player, PlayerClass } from './Player'
import { Role } from '../types'
import { TimeControl } from './TimeControl'
import { AdvancedSettings, GameSettings, PlayerSettings, SettingMetadata } from './GameSettings'
import { DataCollection, DataMapping } from '@typinghare/extrum'

/**
 * Callback function fired when the game stops.
 */
export type StopCallback = (stopperRole: Role | undefined, timeUpRole: Role | undefined) => void

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
    P extends PlayerSettings = PlayerSettings,
    A extends AdvancedSettings = AdvancedSettings,
    M extends SettingMetadata = SettingMetadata
> {
    /**
     * The settings of this game.
     * @protected
     */
    protected readonly gameSettings: GameSettings<P, A, M>

    /**
     * The map of players.
     * @protected
     */
    protected readonly playerMap: Map<Role, Player> = new Map()

    /**
     * The status of this game.
     * @protected
     */
    protected gameStatus: GameStatus = GameStatus.PENDING

    /**
     * Callback function fired when the game stops.
     * @protected
     */
    protected stopCallback?: StopCallback

    /**
     * The role whose timer stops due to time up.
     * @protected
     */
    protected timeUpRole ?: Role

    /**
     * Creates a game.
     * @param roleList The array of roles.
     * @param timeControl The time control applied.
     * @param playerClass The player class.
     */
    constructor(
        protected readonly roleList: Role[],
        protected readonly timeControl: TimeControl<P>,
        protected readonly playerClass: PlayerClass<P>,
    ) {
        // Create game settings
        this.gameSettings = new GameSettings<P, A, M>(this)

        // Initialize players
        this.playerMap = new Map()
        roleList.forEach(role => {
            const player = new playerClass(this, role)
            this.playerMap.set(role, player)
        })
    }

    /**
     * Sets the stop callback function.
     * @param stopCallback Callback function fired when the game stops.
     */
    set onStop(stopCallback: StopCallback) {
        this.stopCallback = stopCallback
    }

    /**
     * Returns the role array.
     */
    getRoleList(): Role[] {
        return this.roleList
    }

    getTimeControl(): TimeControl<P> {
        return this.timeControl
    }

    /**
     * Returns the index of a role.
     * @param role The role of the index.
     * @throws Error if the role does not exist.
     */
    getRoleIndex(role: Role): number {
        const index = this.roleList.indexOf(role)
        if (index === -1) {
            throw new Error('The role does not exist.')
        }

        return index
    }

    /**
     * Returns a player by specified role.
     * @param role The role of the specified player.
     */
    getPlayer(role: Role): Player {
        return this.playerMap.get(role)!
    }

    /**
     * Returns the index of the next role.
     * @param role The current role.
     */
    getNextIndex(role: Role): number {
        return (this.getRoleIndex(role) + 1) % this.roleList.length
    }

    /**
     * Returns the next role.
     * @param role The current role.
     */
    getNextRole(role: Role): Role {
        return this.roleList[this.getNextIndex(role)]
    }

    /**
     * Returns the next player.
     * @param role
     */
    getNextPlayer(role: Role): Player {
        return this.getPlayer(this.getNextRole(role))
    }

    /**
     * Starts this game.
     */
    start(): void {
        // Players get ready
        for (const player of this.playerMap.values()) {
            player.getReady()
        }

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
    stop(stopperRole?: Role | undefined, timeUpRole?: Role | undefined): void {
        this.gameStatus = GameStatus.STOPPED

        this.timeUpRole = timeUpRole

        // Fire the stop callback function
        if (this.stopCallback) {
            this.stopCallback(stopperRole, timeUpRole)
        }
    }

    /**
     * Returns game status.
     */
    getGameStatus(): GameStatus {
        return this.gameStatus
    }

    /**
     * Returns time up role.
     */
    getTimeUpRole(): Role | undefined {
        return this.timeUpRole
    }

    /**
     * Returns game settings.
     */
    getGameSettings(): GameSettings<P, A, M> {
        return this.gameSettings
    }

    /**
     * Initializes advanced game settings.
     */
    initializeAdvancedSettings(): DataCollection<A> {
        return new DataCollection({} as DataMapping<A>)
    }
}