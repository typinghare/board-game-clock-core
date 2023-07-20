import { Role } from '../types'
import { Game } from './Game'
import { TimerController } from './TimerController'
import { DataCollection, DataMapping, Metadata } from '@typinghare/extrum'
import { PlayerSettings } from './GameSettings'
import { TimerControllerNotFoundException } from './exception/TimerControllerNotFoundException'

/**
 * Player class type.
 */
export type PlayerClass<
    P extends PlayerSettings = PlayerSettings,
    A extends Attribute = Attribute,
    M extends Metadata = AttributeMetadata
> = new (...args: any[]) => Player<P, A, M>

/**
 * Attribute type.
 */
export interface Attribute {
}

/**
 * Attribute metadata type.
 */
export interface AttributeMetadata {
    label: string
}

/**
 * Board game player.
 */
export class Player<
    P extends PlayerSettings = PlayerSettings,
    A extends Attribute = Attribute,
    M extends Metadata = AttributeMetadata
> {
    /**
     * Timer controller.
     * @protected
     */
    protected timerController?: TimerController<P>

    /**
     * Player attributes.
     * @protected
     */
    protected attributes: DataCollection<A, M>

    /**
     * Creates a player.
     * @param game The board game creating this player.
     * @param role The role of this player.
     */
    constructor(
        protected game: Game<P>,
        protected role: Role,
    ) {
        this.attributes = this.initializeAttributes()
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
     * Returns player attributes.
     */
    getAttributes(): DataCollection<A, M> {
        this.updateAttributes()

        return this.attributes
    }

    /**
     * Creates and returns a timer controller.
     * @protected
     */
    protected createTimerController(): TimerController<P> {
        // @ts-ignore
        return new TimerController(this)
    }

    /**
     * Initialize player attributes.
     */
    protected initializeAttributes(): DataCollection<A, M> {
        return new DataCollection<A, M>({} as DataMapping<A, M>)
    }

    /**
     * Updates player attributes.
     * @protected
     */
    protected updateAttributes(): void {
    }
}