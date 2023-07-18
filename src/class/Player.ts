import { Role } from '../types'
import { Game } from './Game'
import { TimerController } from './TimerController'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import { DataCollection } from '@typinghare/extrum'
import { PlayerSettings } from './GameSettings'

export type PlayerClass = new (...args: ConstructorParameters<typeof Player>) => Player

/**
 * Board game player.
 */
export class Player<P extends PlayerSettings = PlayerSettings> {
    /**
     * Timer controller.
     * @protected
     */
    protected internalTimerController?: TimerController

    /**
     * Creates a player.
     * @param game The board game creating this player.
     * @param role The role of this player.
     */
    constructor(
        protected game: Game<any, P>,
        protected role: Role,
    ) {
    }

    /**
     * Returns the role of this player.
     */
    getRole(): Role {
        return this.role
    }

    /**
     * Returns the timer controller.
     */
    getTimerController(): TimerController | undefined {
        return this.internalTimerController
    }

    /**
     * Returns this player's settings.
     */
    getSettings(): DataCollection<P> {
        return this.game.getGameSettings().getPlayerSettings(this.role)
    }

    /**
     * This player's timer ends (time is up).
     */
    timerEnd(): void {
        this.game.stop(this.role, this.role)
    }

    /**
     * Creates and returns a timer controller.
     * @protected
     */
    protected createTimerController(): TimerController {
        const playerSettings = this.game.getGameSettings().getPlayerSettings(this.role)
        const main: HourMinuteSecond = playerSettings.getDatum('main').value

        return new TimerController(this)
    }
}