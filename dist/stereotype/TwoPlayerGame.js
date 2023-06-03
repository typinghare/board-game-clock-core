"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoPlayerGame = void 0;
const Game_1 = require("../Game");
/**
 * Abstract two-player board game.
 * @author James Chan
 */
class TwoPlayerGame extends Game_1.Game {
    /**
     * Creates a two-player board game.
     * @param timeControlClass - Class of creating a time control.
     * @param playerClass - Mapping of roles to players.
     * @protected
     */
    constructor(timeControlClass, playerClass) {
        super([...TwoPlayerGame.DEFAULT_ROLE_ARRAY], timeControlClass, playerClass);
    }
}
exports.TwoPlayerGame = TwoPlayerGame;
TwoPlayerGame.DEFAULT_ROLE_ARRAY = ['A', 'B'];
