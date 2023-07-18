/**
 * Game status.
 */
export enum GameStatus {
    PENDING = 0,    // The game has been created but not started.
    STARTED = 1,    // The game has been started.
    PAUSED = 2,     // The game has been paused.
    STOPPED = 3     // The game has stopped. Note that a stopped game cannot be resumed.
}

/**
 * Abstract board game. We simplify "board game" to "game" in this library because "board game" is too long.
 * @param <G> - Game settings.
 */
export class Game<G> {

}