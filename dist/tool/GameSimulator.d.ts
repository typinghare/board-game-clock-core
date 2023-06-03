import { AnyGame } from '../types';
/**
 * A terminal-based board game clock simulator.
 * @author James Chan
 */
export declare class GameClockSimulator {
    /**
     * Default refresh rate.
     * @private
     */
    private static DEFAULT_REFRESH_RATE;
    /**
     * The game.
     * @private
     */
    private readonly _game;
    /**
     * The refresh rate per second.
     * @private
     */
    private readonly _refreshRate;
    /**
     * Creates a game simulator.
     * @param game - Game.
     * @param refreshRate - Refresh rate.
     */
    constructor(game: AnyGame, refreshRate?: number);
    start(): void;
    private print;
    private getPlayerString;
    private initializeKeypress;
    private getClassName;
}
