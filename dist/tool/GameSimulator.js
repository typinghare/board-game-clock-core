"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameClockSimulator = void 0;
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
const keypress = require('keypress');
/**
 * A terminal-based board game clock simulator.
 * @author James Chan
 */
class GameClockSimulator {
    /**
     * Creates a game simulator.
     * @param game - Game.
     * @param refreshRate - Refresh rate.
     */
    constructor(game, refreshRate = GameClockSimulator.DEFAULT_REFRESH_RATE) {
        this._game = game;
        this._refreshRate = refreshRate;
    }
    start() {
        const roleArray = this._game.roleArray;
        const firstPlayer = this._game.getPlayer(roleArray[0]);
        const gameClassName = this.getClassName(this._game);
        const timeControlClassName = this.getClassName(firstPlayer.timeControl);
        const playerClassName = this.getClassName(firstPlayer);
        this.print(`Initializing board game (${gameClassName}<${timeControlClassName}, ${playerClassName}>)...`);
        // Prints all roles.
        this.print(`There are ${roleArray.length} roles in the board game: [${roleArray.join(', ')}].`);
        // Starts the game.
        this._game.start();
        this.print('Board game has started. You can mock players\' clicking by pressing corresponding number keys.\n');
        const startTimestamp = new Date().getTime();
        let firstTime = false;
        const intervalHandle = setInterval(() => {
            if (!firstTime) {
                firstTime = true;
            }
            else {
                process.stdout.cursorTo(0);
                for (let i = 0; i < roleArray.length + 2; i++) {
                    process.stdout.moveCursor(0, -1);
                    process.stdout.clearLine(0);
                }
            }
            // Print players.
            process.stdout.write(this.getPlayerString(roleArray));
            // Print time run.
            const runTime = Math.floor((new Date().getTime() - startTimestamp) / hour_minute_second_1.HourMinuteSecond.MILLISECONDS_IN_SECOND);
            this.print('\n' + `(${runTime} seconds has run)`);
        }, Math.round(hour_minute_second_1.HourMinuteSecond.MILLISECONDS_IN_SECOND / this._refreshRate));
        // Stops interval when the game stops.
        this._game.clockTimeUpCallback = (timeUpRole) => {
            clearInterval(intervalHandle);
            this._game.stop();
            this.print(`\nThe board game has been stopped because Player ${timeUpRole.toString()} has run out of time.`);
            process.exit(0);
        };
        // Initialize keypress.
        this.initializeKeypress(roleArray);
    }
    print(content) {
        process.stdin.pause();
        console.log(content);
        process.stdin.resume();
    }
    getPlayerString(roleArray) {
        const clockStringArray = [];
        for (let i = 0; i < roleArray.length; i++) {
            const role = roleArray[i];
            const player = this._game.getPlayer(role);
            clockStringArray[i] = role + `(${i + 1}): ` + player.clockController.clockTime.toString();
            // Appends extra properties.
            const playerAttributes = player.attributes.getSettings();
            if (Object.keys(playerAttributes).length > 0) {
                const attributeStringArray = [];
                for (const attribute of Object.values(playerAttributes)) {
                    attributeStringArray.push(`${attribute.getProperty('label')}: ${attribute.value}`);
                }
                clockStringArray[i] += ` (${attributeStringArray.join(', ')})`;
            }
        }
        return clockStringArray.join('\n') + '\n';
    }
    initializeKeypress(roleArray) {
        keypress(process.stdin);
        process.stdin.on('keypress', (ch, key) => {
            const num = parseInt(ch);
            if (!isNaN(num) && num >= 1 && num <= roleArray.length) {
                const role = roleArray[num - 1];
                this._game.getPlayer(role).click();
            }
            // Ctrl-C exits program.
            if (key && key.ctrl && key.name == 'c') {
                process.stdin.pause();
                process.exit(0);
            }
        });
        process.stdin.setRawMode(true);
        process.stdin.resume();
    }
    getClassName(object) {
        return Object.getPrototypeOf(object).constructor.name;
    }
}
exports.GameClockSimulator = GameClockSimulator;
/**
 * Default refresh rate.
 * @private
 */
GameClockSimulator.DEFAULT_REFRESH_RATE = 20;
