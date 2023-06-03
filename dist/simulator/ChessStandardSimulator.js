"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameSimulator_1 = require("../tool/GameSimulator");
const ChessGame_1 = require("../game/chess/ChessGame");
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
const chessGame = ChessGame_1.ChessGameSupplierMap.Standard();
for (const role of chessGame.roleArray) {
    const player = chessGame.getPlayer(role);
    const settings = player.timeControl.settings;
    settings.getSetting('main').value = hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(20);
    settings.getSetting('timeIncrement').value = hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(5);
}
new GameSimulator_1.GameClockSimulator(chessGame).start();
