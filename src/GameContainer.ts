import { Games, GameType, TimeControlType } from './types'
import { GameTypeNotFoundException } from './exception/GameTypeNotFoundException'
import { TimeControlNotFoundException } from './exception/TimeControlNotFoundException'

/**
 * Board game container.
 * @author James Chan
 */
export abstract class GameContainer<GT extends GameType, G extends Games<GT>> {
    /**
     * Games.
     * @private
     */
    private readonly _games: G

    /**
     * Creates a game container.
     */
    public constructor() {
        this._games = this.initializeGames()
    }

    /**
     * Initializes games.
     * @protected
     */
    protected abstract initializeGames(): G;

    /**
     * Returns game types. It is recommended that game types apply PascalCase.
     */
    getGameTypes(): GT[] {
        return Object.keys(this._games) as GT[]
    }

    /**
     * Returns all time controls of a specified game type.
     */
    getTimeControls<K extends GT>(gameType: K): (keyof G[K])[] {
        if (!this._games.hasOwnProperty(gameType)) {
            throw new GameTypeNotFoundException(gameType)
        }

        return Object.keys(this._games[gameType])
    }

    /**
     * Returns a game supplier.
     * @param gameType - The type of game.
     * @param timeControlType - A specified time control type.
     */
    getGameSupplier<K extends GT, T extends keyof G[K]>(
        gameType: K,
        timeControlType: T,
    ): G[K][T] {
        if (!this._games.hasOwnProperty(gameType)) {
            throw new GameTypeNotFoundException(gameType)
        }

        const game = this._games[gameType]
        if (!game.hasOwnProperty(timeControlType)) {
            throw new TimeControlNotFoundException(gameType, timeControlType as TimeControlType)
        }

        return game[timeControlType]
    }
}