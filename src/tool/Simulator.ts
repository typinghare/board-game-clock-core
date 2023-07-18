import { Game } from '../class/Game'
import { Player } from '../class/Player'
import { getClassName } from '../util'
import * as process from 'process'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import { Role } from '../types'

const keypress = require('keypress')

type KeypressCallback = (ch: string) => void

export class Simulator {
    /**
     * Default game refresh rate.
     * @private
     */
    private static DEFAULT_REFRESH_RATE: number = 20

    /**
     * Creates a game simulator.
     * @param game - The game to simulate.
     * @param refreshRate - The game refresh rate.
     */
    constructor(
        private game: Game,
        private readonly refreshRate: number = Simulator.DEFAULT_REFRESH_RATE,
    ) {
    }

    /**
     * Starts simulation.
     */
    start(): void {
        const roleArray: Role[] = this.game.getRoleArray()
        const player: Player = this.game.getPlayer(roleArray[0])
        const gameClassName: string = getClassName(this.game)
        const playerClassName: string = getClassName(player)
        const timeControlClassName: string = getClassName(player.getTimeControl())

        // Prints game information.

        // Prints player roles.

        // Starts the game.
        this.game.start()
        this.print(`Board game has started. You can mock players' clicking by pressing corresponding number keys.`)

        // Sets interval.
        const startTimestamp = new Date().getTime()
        const intervalHandle = setInterval((): void => {
            process.stdout.cursorTo(0)
            for (let i = 0; i < roleArray.length + 2; i++) {
                process.stdout.moveCursor(0, -1)
                process.stdout.clearLine(0)
            }

            // Print players.
            this.print(this.getPlayerString(roleArray))

            // Print elapsed time.
            const runTime: number
                = Math.floor((new Date().getTime() - startTimestamp) / HourMinuteSecond.MILLISECONDS_IN_SECOND)
            this.print(`\n(${runTime} seconds has elapsed)`)
        })

        // Stops interval when the game stops.
        // this.game.clockTimeUpCallback = (timeUpRole): void => {
        //     clearInterval(intervalHandle)
        //     this.game.stop()
        //
        //     this.print(`\nThe board game has been stopped because Player ${timeUpRole.toString()} has run out of time.`)
        //     process.exit(0)
        // }

        // Initialize keypress.
        this.enableKeypress((ch) => {

        })
    }

    private getPlayerString(roleArray: Role[]): string {
        const clockStringArray: string[] = []
        for (let i = 0; i < roleArray.length; i++) {
            const role: Role = roleArray[i]
            const player = this.game.getPlayer(role)
            // clockStringArray[i] = role + `(${i + 1}): ` + player.clockController.clockTime.toString()
            //
            // // Appends extra properties.
            // const playerAttributes = player.attributes.getSettings()
            // if (Object.keys(playerAttributes).length > 0) {
            //     const attributeStringArray: string[] = []
            //     for (const attribute of Object.values(playerAttributes)) {
            //         attributeStringArray.push(`${attribute.getProperty('label')}: ${attribute.value}`)
            //     }
            //
            //     clockStringArray[i] += ` (${attributeStringArray.join(', ')})`
            // }
        }

        return clockStringArray.join('\n') + '\n'
    }

    /**
     * Prints content.
     * @param content The content to print.
     * @private
     */
    private print(content: string): void {
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
        keypress(process.stdin)

        process.stdin.on('keypress', (ch, key): void => {
            onKeypress(ch)

            // Ctrl+C exits program.
            if (key && key.ctrl && key.name == 'c') {
                process.stdin.pause()
                process.exit(0)
            }
        })

        process.stdin.setRawMode(true)
        process.stdin.resume()
    }
}