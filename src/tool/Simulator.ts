import { Game, GameStatus } from '../class/Game'
import { AttributeMetadata, Player } from '../class/Player'
import { getClassName } from '../util'
import * as process from 'process'
import { Role } from '../types'
import * as readline from 'readline'
import { max, toNumber } from 'lodash'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import chalk from 'chalk'
import { Datum } from '@typinghare/extrum'

type KeypressCallback = (ch: string, key: any) => void

export class Simulator {
    /**
     * Default game refresh rate.
     * @private
     */
    private static DEFAULT_REFRESH_RATE: number = 12

    /**
     * The interval between two frames.
     * @protected
     */
    protected readonly interval: number

    /**
     * Creates a game simulator.
     * @param game - The game to simulate.
     * @param refreshRate - The game refresh rate.
     */
    constructor(
        private game: Game,
        refreshRate: number = Simulator.DEFAULT_REFRESH_RATE,
    ) {
        this.interval = Math.round(HourMinuteSecond.MILLISECONDS_IN_SECOND / refreshRate)
    }

    /**
     * Starts simulation.
     */
    start(): void {
        const roleList: Role[] = this.game.getRoleList()

        this.printGameInformation()
        this.printPlayersInformation()

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

        // Enable keypress
        this.enableKeypress((ch) => {
            const numberKey = toNumber(ch)
            if (!isNaN(numberKey)) {
                if (numberKey <= roleList.length && numberKey >= 1) {
                    const role = roleList[numberKey - 1]
                    const player = this.game.getPlayer(role)
                    player.tap()
                }
            }
        })

        // Start the game
        this.game.start()
        this.print()
        this.print(`The game has been started.`)
        this.print(`You can mock players' tapping by pressing corresponding number keys.`)
        this.print(`Press Ctrl+C to exit the program.\n`)

        // Set interval
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

            // Print players
            this.print(this.getPlayerString())

            // Print elapsed time
            const elapsedTime: number
                = Math.floor((new Date().getTime() - startTimestamp) / HourMinuteSecond.MILLISECONDS_IN_SECOND)
            this.print(`(${elapsedTime} seconds has elapsed)`)
        }, this.interval)
    }

    private printGameInformation(): void {
        const roleList = this.game.getRoleList()
        const player: Player = this.game.getPlayer(roleList[0])
        const gameClassName: string = getClassName(this.game)
        const playerClassName: string = getClassName(player)
        const timeControlClassName: string = getClassName(this.game.getTimeControl())

        this.print(`[ Game ]`)
        const object: Record<string, any> = {
            'Game Class': gameClassName,
            'Player Class': playerClassName,
            'Time Control Class': timeControlClassName,
        }
        const keys: string[] = ['Game Class', 'Player Class', 'Time Control Class']
        this.printObject(object, keys)
    }

    private printPlayersInformation(): void {
        const roleList = this.game.getRoleList()

        this.print(`[ Player ]`)

        for (const role of roleList) {
            this.print(`player ${role}: `)

            const player = this.game.getPlayer(role)
            const playerSettingsDatumList: Datum<any>[] = Object.values(player.getSettings().getData())
            const object: Record<string, any> = {}
            const keys: string[] = []

            for (const datum of playerSettingsDatumList) {
                const label = datum.getMetadata('label')
                object[label] = datum.value
                keys.push(label)
            }

            this.printObject(object, keys, 4)
        }
    }

    private getPlayerString(): string {
        const roleList = this.game.getRoleList()

        const playerStringArray: string[] = []
        const isGameStopped = this.game.getGameStatus() === GameStatus.STOPPED
        const timeUpRole = this.game.getTimeUpRole()
        for (let i = 0; i < roleList.length; i++) {
            const role: Role = roleList[i]
            const player = this.game.getPlayer(role)
            const timerController = player.getTimerController()
            const time = timerController.getTime()
            const isTimerRunning = timerController.isTimerRunning()

            if (isGameStopped && timeUpRole === role) {
                playerStringArray[i] = `${role}(${i + 1}): ${chalk.red(time)}`
            } else {
                playerStringArray[i] = `${role}(${i + 1}): ` + (
                    isTimerRunning ? chalk.green(time) : chalk.grey(time)
                )
            }

            // // Appends extra properties.
            const playerAttributes = player.getAttributes()
            const datumList: Datum<any, AttributeMetadata>[] = Object.values(playerAttributes.getData())
            if (datumList.length > 0) {
                const attributeStringArray: string[] = []
                for (const datum of datumList) {
                    attributeStringArray.push(`${datum.getMetadata('label')}: ${datum.value}`)
                }

                playerStringArray[i] += ` (${attributeStringArray.join(', ')})`
            }
        }

        return playerStringArray.join('\n') + '\n'
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

    private printObject(objectToPrint: Record<string, any>, keys: string[], indentationWidth: number = 0): void {
        const maxKeyLength: number = max(keys.map(key => key.length)) || 0
        const keyWidth = maxKeyLength + 2
        const indentation = ' '.repeat(indentationWidth)

        for (const key of keys) {
            this.print(`${indentation}${key.padEnd(keyWidth)} ${objectToPrint[key]}`)
        }
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