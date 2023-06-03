import { SettingContainer } from '@typinghare/settings';
import { PlayerAttributeProperties, PlayerAttributes, Role, TimeControlSettings } from './types';
import { Game } from './Game';
import { TimeControl } from './TimeControl';
import { ClockController } from './ClockController';
/**
 * Abstract board game player.
 * @param <T> - Time control settings.
 * @param <TS> - Time control settings.
 * @param <PA> - Player attributes.
 * @param <PP> - Player attributes properties.
 * @author James Chan
 */
export declare abstract class Player<T extends TimeControl<TS> = TimeControl, TS extends TimeControlSettings = any, PA extends PlayerAttributes = any, PP extends PlayerAttributeProperties = any> {
    /**
     * Player attributes.
     * @private
     */
    protected readonly _attributes: SettingContainer<PA, PP>;
    /**
     * The role of this player.
     * @protected
     */
    protected readonly _role: Role;
    /**
     * The game creating this player.
     * @protected
     */
    protected readonly _game: Game<any, T, Player<T, TS, PA, PP>>;
    /**
     * Time control.
     * @protected
     */
    protected readonly _timeControl: T;
    /**
     * Clock controller.
     * @protected
     */
    protected _clockController?: ClockController<TS>;
    /**
     * Creates a player.
     * @param role - The role of this player.
     * @param game - The game creating this player.
     * @param timeControl
     */
    constructor(role: Role, game: Game<any, T, Player<T, TS, PA, PP>>, timeControl: T);
    /**
     * Creates a controller.
     * @protected
     */
    protected abstract createClockController(): ClockController<TS>;
    /**
     * Updates attributes.
     * @protected
     */
    protected updateAttributes(): void;
    /**
     * Player clicks the screen.
     */
    click(): void;
    /**
     * Return this player's attributes.
     */
    get attributes(): SettingContainer<PA, PP>;
    /**
     * Return time control.
     */
    get timeControl(): T;
    get clockController(): ClockController<TS>;
    /**
     * This player runs out of time.
     */
    timeUp(): void;
    /**
     * Initialize controller.
     */
    initializeClockController(): void;
}
