import { ClockTimeUpCallback, GameSettingProperties, GameSettings, JsonObjectEquivalent, PlayerAttributeProperties, PlayerAttributes, PlayerClass, Role, TimeControlClass, TimeControlSettings } from './types';
import { SettingContainer } from '@typinghare/settings';
import { Player, PlayerJsonObject } from './Player';
import { TimeControl } from './TimeControl';
export declare enum GameStatus {
    PENDING = 0,
    STARTED = 1,
    PAUSED = 2,
    STOPPED = 3
}
export type GameJsonObject = {
    settings: Record<string, any>;
    roleArray: Role[];
    playerArray: PlayerJsonObject[];
    gameStatus: number;
    timeUpRole?: Role;
};
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
export declare abstract class Game<G extends GameSettings = GameSettings, T extends TimeControl<TS> = TimeControl, P extends Player<T, TS, PA, PP> = Player<T>, TS extends TimeControlSettings = TimeControlSettings, PA extends PlayerAttributes = PlayerAttributes, PP extends PlayerAttributeProperties = PlayerAttributeProperties> implements JsonObjectEquivalent<GameJsonObject> {
    /**
     * Game settings.
     * @private
     */
    protected readonly _settings: SettingContainer<G, GameSettingProperties<any>>;
    /**
     * An array of role labels.
     * @private
     */
    protected readonly _roleArray: Role[];
    /**
     * Mapping of roles to players.
     * @private
     */
    protected readonly _playerMap: Map<Role, P>;
    /**
     * Game status.
     * @private
     */
    protected _gameStatus: GameStatus;
    /**
     * Clock time up callback.
     * @private
     */
    protected _clockTimeUpCallback?: ClockTimeUpCallback;
    /**
     * Role that runs out of time.
     * @private
     */
    protected _timeUpRole?: Role;
    /**
     * Time control class.
     * @protected
     */
    protected _timeControlClass: TimeControlClass<T>;
    /**
     * Player class.
     * @protected
     */
    protected _playerClass: PlayerClass<any, P>;
    /**
     * Creates a board game.
     * @param roleArray - An array of role labels.
     * @param timeControlClass - Class of creating a time control.
     * @param playerClass - Mapping of roles to players.
     * @protected
     */
    constructor(roleArray: Role[], timeControlClass: TimeControlClass<T>, playerClass: PlayerClass<T, P>);
    /**
     * Initialize settings for this board game.
     * @protected
     */
    protected initializeSettings(): void;
    /**
     * Returns this board game's settings.
     */
    get settings(): SettingContainer<G, GameSettingProperties>;
    /**
     * Returns the role array.
     */
    get roleArray(): Role[];
    /**
     * Gets a player.
     * @param role the role of the player.
     */
    getPlayer(role: Role): P;
    /**
     * Returns the next role.
     * @param role the current role.
     */
    getNextRole(role: Role): Role;
    /**
     * Returns the next player.
     * @param role the current role.
     */
    getNextPlayer(role: Role): P;
    /**
     * Starts this game.
     */
    start(): void;
    /**
     * Stops this game.
     */
    stop(): void;
    /**
     * Returns game status.
     */
    get gameStatus(): GameStatus;
    /**
     * Sets time up callback function.
     * @param timeUpCallback
     */
    set clockTimeUpCallback(timeUpCallback: ClockTimeUpCallback);
    /**
     * A specified role runs out of time.
     * @param role
     */
    timeUp(role: Role): void;
    /**
     * Returns role that runs out of time; undefined if no role runs out of time.
     */
    get timeUpRole(): Role | undefined;
    toJsonObject(): GameJsonObject;
    fromJsonObject(jsonObject: GameJsonObject): void;
}
