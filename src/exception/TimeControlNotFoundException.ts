import { GameType, TimeControlType } from '../types'

export class TimeControlNotFoundException extends Error {
    constructor(gameType: GameType, timeControlType: TimeControlType) {
        super(`Time control not found: ${timeControlType} in the game of ${gameType}.`)
    }
}