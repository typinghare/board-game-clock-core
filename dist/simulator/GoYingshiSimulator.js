"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoGame_1 = require("../game/go/GoGame");
const hour_minute_second_1 = require("@typinghare/hour-minute-second");
const GameSimulator_1 = require("../tool/GameSimulator");
const goGame = GoGame_1.GoGameSupplierMap.Yingshi();
for (const role of goGame.roleArray) {
    const player = goGame.getPlayer(role);
    const settings = player.timeControl.settings;
    settings.getSetting('main').value = hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(15);
    settings.getSetting('penaltyTime').value = hour_minute_second_1.SlowHourMinuteSecond.ofSeconds(10);
    settings.getSetting('maxPenalties').value = 2;
}
new GameSimulator_1.GameClockSimulator(goGame).start();
