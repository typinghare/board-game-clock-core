"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameSimulator_1 = require("../tool/GameSimulator");
const DefaultGame_1 = require("../game/default/DefaultGame");
new GameSimulator_1.GameClockSimulator(new DefaultGame_1.DefaultGame()).start();
