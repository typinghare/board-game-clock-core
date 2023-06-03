import { GameHolder, GameHolderJsonObject } from '../GameHolder'
import { StandardGameContainer, StandardGames, StandardGameType } from './StandardGameContainer'
import { Game } from '../Game'
import { GameSupplier, GameType, TimeControlType } from '../types'

export class StandardGameHolder extends GameHolder<StandardGames> {
    constructor(gameHolderJsonObject: GameHolderJsonObject)
    constructor(gameType: GameType, timeControlType: TimeControlType, game: Game)
    constructor(gameTypeOrGameHolderJsonObject: GameType | GameHolderJsonObject, timeControlTypeOrGame?: TimeControlType, game?: Game) {
        if (typeof gameTypeOrGameHolderJsonObject == 'object') {
            const gameSupplier: GameSupplier = new StandardGameContainer().getGameSupplier(
                gameTypeOrGameHolderJsonObject.gameType as StandardGameType,
                // @ts-ignore
                gameTypeOrGameHolderJsonObject.timeControlType,
            )
            super(gameTypeOrGameHolderJsonObject, gameSupplier())
        } else {
            super(gameTypeOrGameHolderJsonObject, timeControlTypeOrGame as TimeControlType, game as Game)
        }
    }
}