"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessGameSupplierMap = exports.ChessGameTimeControl = exports.ChessGame = void 0;
const TwoPlayerGame_1 = require("../../stereotype/TwoPlayerGame");
const ChessStandard_1 = require("./ChessStandard");
class ChessGame extends TwoPlayerGame_1.TwoPlayerGame {
    initializeSettings() {
        this.settings.addSetting('sync', true, {
            type: 'bool',
            label: 'Sync',
            description: 'This is a description.',
        });
    }
}
exports.ChessGame = ChessGame;
exports.ChessGameTimeControl = ['Standard'];
exports.ChessGameSupplierMap = {
    Standard: () => new ChessGame(ChessStandard_1.ChessStandardTimeControl, ChessStandard_1.ChessStandardPlayer),
};
