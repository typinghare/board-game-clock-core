"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoGameSupplierMap = exports.GoGameTimeControl = exports.GoGame = void 0;
const TwoPlayerGame_1 = require("../../stereotype/TwoPlayerGame");
const GoByoyomi_1 = require("./GoByoyomi");
const GoYingshi_1 = require("./GoYingshi");
class GoGame extends TwoPlayerGame_1.TwoPlayerGame {
    initializeSettings() {
        this.settings.addSetting('sync', true, {
            type: 'bool',
            label: 'Sync',
            description: 'This is a description.',
        });
    }
}
exports.GoGame = GoGame;
exports.GoGameTimeControl = ['Byoyomi', 'Yingshi'];
exports.GoGameSupplierMap = {
    Byoyomi: () => new GoGame(GoByoyomi_1.GoByoyomiTimeControl, GoByoyomi_1.GoByoyomiPlayer),
    Yingshi: () => new GoGame(GoYingshi_1.GoYingshiTimeControl, GoYingshi_1.GoYingshiPlayer),
};
