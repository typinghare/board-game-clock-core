import { Game, GameStatus } from '../class/Game'
import { Player } from '../class/Player'
import { getClassName } from '../util'
import * as process from 'process'
import { Role } from '../types'
import * as readline from 'readline'
import { toNumber } from 'lodash'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import chalk from 'chalk'

type KeypressCallback = (ch: string, key: any) => void

export class Simulator {
    /**
     * Default game refresh rate.
     * @private
     */
    private static DEFAULT_REFRESH_RATE: number = 30

    protected readonly interval: number

    /**
     * Creates a game simulator.
     * @param game - The game to simulate.
     * @param refreshRate - The game refresh rate.
     */
    constructor(
        private game: Game,
        private readonly refreshRate: number = Simulator.DEFAULT_REFRESH_RATE,
    ) {
        this.interval = Math.round(HourMinuteSecond.MILLISECONDS_IN_SECOND / refreshRate)
    }

    /**
     * Starts simulation.
     */
    start(): void {
        const roleList: Role[] = this.game.getRoleList()
        const player: Player = this.game.getPlayer(roleList[0])
        const gameClassName: string = getClassName(this.game)
        const playerClassName: string = getClassName(player)
        const timeControlClassName: string = getClassName(this.game.getTimeControl())

        // Prints game information.
        this.print(`[ Game ]`)
        this.print(`Game Class: ${gameClassName}`)
        this.print(`Player Class: ${playerClassName}`)
        this.print(`Time Control Class: ${timeControlClassName}`)

        // Prints player information
        this.print()
        this.print(`[ Player ]`)

        // Stops interval when the game stops
        this.game.onStop = (stopperRole, timeUpRole) => {
            // Stop the game until the next frame
            setTimeout(() => {
                clearInterval(intervalHandle)

                if (timeUpRole) {
                    this.print(`\nThe board game has been stopped because` +
                        ` player ${timeUpRole.toString()} has run out of time.`)
                } else if (stopperRole) {
                    // unreachable branch
                }

                process.exit(0)
            }, this.interval)
        }

        // Initialize keypress
        this.enableKeypress((ch) => {
            const numberKey = toNumber(ch)
            if (!isNaN(numberKey)) {
                if (numberKey <= roleList.length) {
                    const role = roleList[numberKey - 1]
                    const player = this.game.getPlayer(role)
                    player.tap()
                }
            }
        })

        // Starts the game.
        this.game.start()
        this.print()
        this.print(`The game has been started.`)
        this.print(`You can mock players' tapping by pressing corresponding number keys.`)
        this.print(`Press Ctrl+C to exit the program.\n`)

        // Sets interval.
        const startTimestamp = new Date().getTime()
        let firstRound: boolean = true
        const intervalHandle = setInterval(() => {
            if (firstRound) {
                firstRound = false
            } else {
                process.stdout.cursorTo(0)
                for (let i = 0; i < roleList.length + 2; i++) {
                    process.stdout.moveCursor(0, -1)
                    process.stdout.clearLine(0)
                }
            }

            // Print players.
            this.print(this.getPlayerString())

            // Print elapsed time.
            const elapsedTime: number
                = Math.floor((new Date().getTime() - startTimestamp) / HourMinuteSecond.MILLISECONDS_IN_SECOND)
            this.print(`(${elapsedTime} seconds has elapsed)`)
        }, this.interval)
    }

    private getPlayerString(): string {
        const roleList = this.game.getRoleList()

        const timerStringArray: string[] = []
        const isGameStopped = this.game.getGameStatus() === GameStatus.STOPPED
        const timeUpRole = this.game.getTimeUpRole()
        for (let i = 0; i < roleList.length; i++) {
            const role: Role = roleList[i]
            const player = this.game.getPlayer(role)
            const timerController = player.getTimerController()
            const time = timerController.getTime()
            const isTimerRunning = timerController.isTimerRunning()

            if (isGameStopped && timeUpRole === role) {
                timerStringArray[i] = `${role}(${i + 1}): ${chalk.red(time)}`
            } else {
                timerStringArray[i] = `${role}(${i + 1}): ` + (
                    isTimerRunning ? chalk.green(time) : chalk.grey(time)
                )
            }

            // // Appends extra properties.
            // const playerAttributes = player
            // if (Object.keys(playerAttributes).length > 0) {
            //     const attributeStringArray: string[] = []
            //     for (const attribute of Object.values(playerAttributes)) {
            //         attributeStringArray.push(`${attribute.getProperty('label')}: ${attribute.value}`)
            //     }
            //
            //     clockStringArray[i] += ` (${attributeStringArray.join(', ')})`
            // }
        }

        return timerStringArray.join('\n') + '\n'
    }

    /**
     * Prints content.
     * @param content The content to print.
     * @private
     */
    private print(content: string = ''): void {
        process.stdin.pause()
        console.log(content)
        process.stdin.resume()
    }

    /**
     * Enable keypress listening.
     * @param onKeypress Callback fired when keypress events triggered.
     * @private
     */
    private enableKeypress(onKeypress: KeypressCallback): void {
        // Enable raw mode to capture keypress events
        readline.emitKeypressEvents(process.stdin)
        process.stdin.setRawMode(true)

        // Listen for individual keypress events
        process.stdin.on('keypress', (ch, key) => {
            if (key['ctrl'] === true && key.name === 'c') {
                process.exit()
            }

            onKeypress(ch === undefined ? '' : ch.toString(), key)
        })

        process.stdin.resume()
    }
}