import { SettingContainer } from '@typinghare/settings'
import { JsonObjectEquivalent, PlayerAttributeProperties, PlayerAttributes, Role, TimeControlSettings } from './types'
import { Game } from './Game'
import { TimeControl, TimeControlJsonObject } from './TimeControl'
import { ClockController, ClockControllerJsonObject } from './ClockController'
import { ClockControllerNotInitializedException } from './exception/ClockControllerNotInitializedException'

export type PlayerJsonObject = {
    timeControl: TimeControlJsonObject,
    clockController?: ClockControllerJsonObject
}

/**
 * Abstract board game player.
 * @param <T> - Time control settings.
 * @param <TS> - Time control settings.
 * @param <PA> - Player attributes.
 * @param <PP> - Player attributes properties.
 * @author James Chan
 */
export abstract class Player<
    T extends TimeControl<TS> = TimeControl,
    TS extends TimeControlSettings = any,
    PA extends PlayerAttributes = any,
    PP extends PlayerAttributeProperties = any,
> implements JsonObjectEquivalent<PlayerJsonObject> {
    /**
     * Player attributes.
     * @private
     */
    protected readonly _attributes = new SettingContainer<PA, PP>()

    /**
     * The role of this player.
     * @protected
     */
    private readonly _role: Role

    /**
     * The game creating this player.
     * @protected
     */
    protected readonly _game: Game<any, T, Player<T, TS, PA, PP>>

    /**
     * Time control.
     * @protected
     */
    protected readonly _timeControl: T

    /**
     * Clock controller.
     * @protected
     */
    protected _clockController?: ClockController<TS>

    /**
     * Creates a player.
     * @param role - The role of this player.
     * @param game - The game creating this player.
     * @param timeControl
     */
    public constructor(role: Role, game: Game<any, T, Player<T, TS, PA, PP>>, timeControl: T) {
        this._role = role
        this._game = game
        this._timeControl = timeControl
    }

    /**
     * Creates a controller.
     * @protected
     */
    protected abstract createClockController(): ClockController<TS>;

    /**
     * Updates attributes.
     * @protected
     */
    protected updateAttributes(): void {
    }

    /**
     * Player clicks the screen.
     */
    click(): void {
        // Pauses this player's clock.
        this.clockController.pauseClock()

        // Resumes next player's clock.
        const nextRole: Role = this._game.getNextRole(this._role)
        this._game.getPlayer(nextRole).clockController.resumeClock()
    }

    /**
     * Return this player's attributes.
     */
    get attributes(): SettingContainer<PA, PP> {
        this.updateAttributes()

        return this._attributes
    }

    /**
     * Returns time control.
     */
    get timeControl(): T {
        return this._timeControl
    }

    /**
     * Returns clock controller.
     */
    get clockController(): ClockController<TS> {
        if (this._clockController === undefined) {
            throw new ClockControllerNotInitializedException()
        }

        return this._clockController
    }

    /**
     * Returns the role of this player.
     */
    get role(): Role {
        return this._role
    }

    /**
     * This player runs out of time.
     */
    timeUp(): void {
        this._game.timeUp(this._role)
    }

    /**
     * Initialize controller.
     */
    initializeClockController(): void {
        this._clockController = this.createClockController()
    }

    toJsonObject(): PlayerJsonObject {
        return {
            timeControl: this._timeControl.toJsonObject(),
            clockController: this._clockController?.toJsonObject(),
        }
    }

    fromJsonObject(jsonObject: PlayerJsonObject): void {
        const { timeControl, clockController } = jsonObject
        this._timeControl.fromJsonObject(timeControl)

        if (clockController) {
            this._clockController?.fromJsonObject(clockController)
        }
    }
}