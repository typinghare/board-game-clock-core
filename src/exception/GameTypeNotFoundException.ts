import { GameType } from '../types'

export class GameTypeNotFoundException extends Error {
    constructor(gameType: GameType) {
        super(`Game Type not found: ${gameType}.`)
    }
}