import { Player } from './Player'
import { Timer } from './Timer'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import { PlayerSettings } from './GameSettings'
import { DataCollection } from '@typinghare/extrum'

/**
 * Timer controller.
 */
export class TimerController<P extends PlayerSettings = PlayerSettings> {
    /**
     * Timer.
     * @protected
     */
    protected readonly timer: Timer

    /**
     * Creates a timer controller.
     * @param player - The player creating this clock controller.
     */
    constructor(
        protected readonly player: Player<P>,
    ) {
        this.timer = this.createTimer()
    }

    /**
     * Whether the timer is running.
     */
    isTimerRunning(): boolean {
        return this.timer.isRunning()
    }

    /**
     * Resumes the timer if it is not running.
     */
    resumeTimer(): void {
        this.isTimerRunning() || this.timer.resume()
    }

    /**
     * Pauses the timer if it is not running.
     */
    pauseClock(): void {
        this.isTimerRunning() && this.timer.pause()
    }

    /**
     * Returns the time of the timer.
     */
    getTime(): HourMinuteSecond {
        return this.timer.time
    }

    /**
     * This player's timer ends (time is up).
     */
    timerEnd(): void {
        this.player.timerEnd()
    }

    /**
     * Creates a timer.
     * @protected
     */
    protected createTimer(): Timer {
        const playerSettings: DataCollection<P> = this.player.getSettings()
        const mainTime: HourMinuteSecond = playerSettings.getValue('main')

        return new Timer(mainTime, () => {
            this.player.timerEnd()
        })
    }
}