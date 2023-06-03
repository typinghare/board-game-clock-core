import { Games, GameType, JsonObjectEquivalent, TimeControlType } from './types'
import { Game, GameJsonObject } from './Game'

export type GameHolderJsonObject = {
    gameType: GameType,
    timeControlType: TimeControlType,
    game: GameJsonObject
}

/**
 * Holds a game.
 */
export class GameHolder<G extends Games<any>> implements JsonObjectEquivalent<GameHolderJsonObject> {
    private readonly _gameType: GameType
    private readonly _timeControlType: TimeControlType
    private readonly _game: Game

    constructor(gameHolderJsonObject: GameHolderJsonObject, game: Game)
    constructor(gameType: GameType, timeControlType: TimeControlType, game: Game)
    constructor(gameTypeOrGameHolderJsonObject: GameType | GameHolderJsonObject, timeControlTypeOrGame: TimeControlType | Game, game?: Game) {
        if (typeof gameTypeOrGameHolderJsonObject == 'object') {
            const { gameType, timeControlType, game } = gameTypeOrGameHolderJsonObject as GameHolderJsonObject
            this._gameType = gameType
            this._timeControlType = timeControlType
            this._game = timeControlTypeOrGame as Game
            this._game.fromJsonObject(game)
        } else {
            this._gameType = gameTypeOrGameHolderJsonObject as string
            this._timeControlType = timeControlTypeOrGame as TimeControlType
            this._game = game!
        }
    }

    get gameType(): GameType {
        return this._gameType
    }

    get timeControlType(): TimeControlType {
        return this._timeControlType
    }

    get game(): Game {
        return this._game
    }

    toJsonObject(): GameHolderJsonObject {
        return {
            gameType: this._gameType,
            timeControlType: this._timeControlType,
            game: this._game.toJsonObject(),
        }
    }

    fromJsonObject(jsonObject: GameHolderJsonObject): void {
        throw new Error('A game holder should be created by constructor(gameHolderJsonObject: GameHolderJsonObject).')
    }
}