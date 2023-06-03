import {
    ClockTimeUpCallback,
    GameSettingProperties,
    GameSettings,
    JsonObjectEquivalent,
    PlayerAttributeProperties,
    PlayerAttributes,
    PlayerClass,
    Role,
    TimeControlClass,
    TimeControlSettings,
} from './types'
import { SettingContainer } from '@typinghare/settings'
import { Player, PlayerJsonObject } from './Player'
import { RoleNotFoundException } from './exception/RoleNotFoundException'
import { TimeControl } from './TimeControl'

export enum GameStatus {
    // The game has been created but not started.
    PENDING = 0,
    // The game has been started.
    STARTED = 1,
    // The game has been paused.
    PAUSED = 2,
    // The game has stopped. Note that a stopped game cannot be resumed.
    STOPPED = 3
}

export type GameJsonObject = {
    settings: Record<string, any>
    roleArray: Role[]
    playerArray: PlayerJsonObject[],
    gameStatus: number,
    timeUpRole?: Role
}

// noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
/**
 * Abstract board game. We simplify "board game" to "game" in this library because "board game" is too long.
 * @param <G> - Game settings.
 * @param <T> - Time control settings.
 * @param <P> - Player.
 * @param <TS> - Time control settings.
 * @param <PA> - Player attributes.
 * @param <PP> - Player attributes properties.
 * @author James Chan
 */
export abstract class Game<
    G extends GameSettings = GameSettings,
    T extends TimeControl<TS> = TimeControl,
    P extends Player<T, TS, PA, PP> = Player<T>,
    TS extends TimeControlSettings = TimeControlSettings,
    PA extends PlayerAttributes = PlayerAttributes,
    PP extends PlayerAttributeProperties = PlayerAttributeProperties,
> implements JsonObjectEquivalent<GameJsonObject> {
    /**
     * Game settings.
     * @private
     */
    protected readonly _settings = new SettingContainer<G, GameSettingProperties>()

    /**
     * An array of role labels.
     * @private
     */
    protected readonly _roleArray: Role[]

    /**
     * Mapping of roles to players.
     * @private
     */
    protected readonly _playerMap: Map<Role, P> = new Map()

    /**
     * Game status.
     * @private
     */
    protected _gameStatus: GameStatus = GameStatus.PENDING

    /**
     * Clock time up callback.
     * @private
     */
    protected _clockTimeUpCallback?: ClockTimeUpCallback

    /**
     * Role that runs out of time.
     * @private
     */
    protected _timeUpRole?: Role

    /**
     * Roles whose clocks are running.
     * @protected
     */
    protected _runningRoleArray?: Role[]

    /**
     * Time control class.
     * @protected
     */
    protected _timeControlClass: TimeControlClass<T>

    /**
     * Player class.
     * @protected
     */
    protected _playerClass: PlayerClass<any, P>

    /**
     * Creates a board game.
     * @param roleArray - An array of role labels.
     * @param timeControlClass - Class of creating a time control.
     * @param playerClass - Mapping of roles to players.
     * @protected
     */
    public constructor(roleArray: Role[], timeControlClass: TimeControlClass<T>, playerClass: PlayerClass<T, P>) {
        this._roleArray = roleArray
        this._timeControlClass = timeControlClass
        this._playerClass = playerClass

        // Initialize players.
        for (const role of roleArray) {
            this._playerMap.set(role, new playerClass(role, this, new timeControlClass()))
        }

        // Initialize settings for this board game.
        this.initializeSettings()
    }

    /**
     * Initialize settings for this board game.
     * @protected
     */
    protected initializeSettings(): void {
    }

    /**
     * Returns this board game's settings.
     */
    get settings(): SettingContainer<G, GameSettingProperties> {
        return this._settings
    }

    /**
     * Returns the role array.
     */
    get roleArray(): Role[] {
        return this._roleArray
    }

    /**
     * Gets a player.
     * @param role the role of the player.
     */
    getPlayer(role: Role): P {
        if (!this._playerMap.has(role)) {
            throw new RoleNotFoundException(role)
        }

        return this._playerMap.get(role)!
    }

    /**
     * Returns the next role.
     * @param role the current role.
     */
    getNextRole(role: Role): Role {
        const roleIndex: number = this._roleArray.indexOf(role)
        if (roleIndex === -1) {
            throw new RoleNotFoundException(role)
        }

        return this._roleArray[(roleIndex + 1) % this._roleArray.length]
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the next player.
     * @param role the current role.
     */
    getNextPlayer(role: Role): P {
        return this.getPlayer(this.getNextRole(role))
    }

    /**
     * Starts this game.
     */
    start(): void {
        if (this._gameStatus !== GameStatus.PENDING) {
            return
        }

        // Initialize clock controllers for all players.
        for (const player of this._playerMap.values()) {
            player.initializeClockController()
        }

        this._gameStatus = GameStatus.STARTED
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Pause this game.
     */
    pause(): void {
        if (this._gameStatus !== GameStatus.STARTED) {
            return
        }

        this._gameStatus = GameStatus.PAUSED

        // Record players whose clocks are running.
        const runningRoleArray = [] as Role[]
        for (const player of this._playerMap.values()) {
            if (player.clockController.isClockRunning()) {
                runningRoleArray.push(player.role)
            }
        }
        this._runningRoleArray = runningRoleArray

        // Pause all player's clocks.
        for (const player of this._playerMap.values()) {
            player.clockController.pauseClock()
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Resumes this game.
     */
    resume(): void {
        if (this._gameStatus !== GameStatus.PAUSED) {
            return
        }

        // Resume.
        if (this._runningRoleArray) {
            for (const role of this._runningRoleArray) {
                this.getPlayer(role).clockController.resumeClock()
            }
        }
        this._runningRoleArray = undefined

        this._gameStatus = GameStatus.STARTED
    }

    /**
     * Stops this game.
     */
    stop(): void {
        this._gameStatus = GameStatus.STOPPED

        // Pause all player's clocks.
        for (const player of this._playerMap.values()) {
            player.clockController.pauseClock()
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns game status.
     */
    get gameStatus(): GameStatus {
        return this._gameStatus
    }

    /**
     * Sets time up callback function.
     * @param timeUpCallback
     */
    set clockTimeUpCallback(timeUpCallback: ClockTimeUpCallback) {
        this._clockTimeUpCallback = timeUpCallback
    }

    /**
     * A specified role runs out of time.
     * @param role
     */
    timeUp(role: Role): void {
        this.getPlayer(role)
        this._timeUpRole = role

        // Stop this board game.
        this.stop()

        // Invoke callback function.
        this._clockTimeUpCallback?.(role)
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns role that runs out of time; undefined if no role runs out of time.
     */
    get timeUpRole(): Role | undefined {
        return this._timeUpRole
    }

    toJsonObject(): GameJsonObject {
        const settings = {}
        for (const [name, setting] of Object.entries(this._settings.getSettings() as object)) {
            // @ts-ignore
            settings[name] = setting.value
        }

        const playerArray = []
        for (const role of this._roleArray) {
            playerArray.push(this.getPlayer(role).toJsonObject())
        }

        return {
            settings,
            roleArray: this.roleArray,
            playerArray,
            gameStatus: this._gameStatus,
            timeUpRole: this._timeUpRole,
        }
    }

    fromJsonObject(jsonObject: GameJsonObject): void {
        const { settings, roleArray, playerArray, gameStatus, timeUpRole } = jsonObject

        for (const [name, settingValue] of Object.entries(settings)) {
            // @ts-ignore
            this._settings.getSetting(name).value = settingValue
        }

        for (let i = 0; i < roleArray.length; i++) {
            const role: Role = roleArray[i]
            this._roleArray[i] = roleArray[i]

            const player = new this._playerClass(role, this, new this._timeControlClass)
            player.fromJsonObject(playerArray[i])
            this._playerMap.set(role, player)
        }

        this._gameStatus = gameStatus
        this._timeUpRole = timeUpRole
    }
}
