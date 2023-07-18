import { Role } from '../types'
import { Game } from './Game'
import { TimerController } from './TimerController'
import { DataCollection } from '@typinghare/extrum'
import { PlayerSettings } from './GameSettings'
import { TimerControllerNotFoundException } from './exception/TimerControllerNotFoundException'

export type PlayerClass = new (...args: ConstructorParameters<typeof Player>) => Player

/**
 * Board game player.
 */
export class Player<P extends PlayerSettings = PlayerSettings> {
    /**
     * Timer controller.
     * @protected
     */
    protected timerController?: TimerController<P>

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
    getTimerController(): TimerController<P> {
        if (this.timerController === undefined) {
            throw new TimerControllerNotFoundException()
        }

        return this.timerController
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
     * This player taps their timer region.
     */
    tap(): void {
        // Pause this player's clock
        this.timerController?.pauseClock()

        // Resume next player's clock
        const nextPlayer = this.game.getNextPlayer(this.role)
        nextPlayer.timerController?.resumeTimer()
    }

    /**
     * This player gets ready for the game. This method is invoked only when the game starts.
     */
    getReady(): void {
        this.timerController = this.createTimerController()
    }

    /**
     * Creates and returns a timer controller.
     * @protected
     */
    protected createTimerController(): TimerController<P> {
        // @ts-ignore
        return new TimerController(this)
    }
}