export class TimerControllerNotFoundException extends Error {
    constructor() {
        super(`The timer controller does not exist. Check if the game has been started.`)
    }
}