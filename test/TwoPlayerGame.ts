import { TwoPlayerGame } from '../src/games/TwoPlayerGame'
import { Player } from '../src/class/Player'
import { TimeControl } from '../src/class/TimeControl'
import { Simulator } from '../src/tool/Simulator'
import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'

const twoPlayerGame = new TwoPlayerGame(new TimeControl(), Player)
const playerA = twoPlayerGame.getPlayer(TwoPlayerGame.ROLE_A)
const playerB = twoPlayerGame.getPlayer(TwoPlayerGame.ROLE_B)
playerA.getSettings().getDatum('main').value = SlowHourMinuteSecond.ofSeconds(15)
playerB.getSettings().getDatum('main').value = SlowHourMinuteSecond.ofSeconds(15)

const simulator = new Simulator(twoPlayerGame)

simulator.start()