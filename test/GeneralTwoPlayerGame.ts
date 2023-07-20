import { TwoPlayerGame } from '../src/games/TwoPlayerGame'
import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { Simulator } from '../src/tool/Simulator'
import { GeneralTwoPlayerGame, GeneralTwoPlayerGamePlayer } from '../src/games/GeneralTwoPlayerGame'

const generalTwoPlayerGame = new GeneralTwoPlayerGame()

const playerA = generalTwoPlayerGame.getPlayer(TwoPlayerGame.ROLE_A) as GeneralTwoPlayerGamePlayer
const playerB = generalTwoPlayerGame.getPlayer(TwoPlayerGame.ROLE_B) as GeneralTwoPlayerGamePlayer

playerA.getSettings().getDatum('main').value = SlowHourMinuteSecond.ofSeconds(15)
playerB.getSettings().getDatum('main').value = SlowHourMinuteSecond.ofSeconds(15)

playerA.getSettings().getDatum('enableByoyomi').value = true
playerB.getSettings().getDatum('enableByoyomi').value = true
playerA.getSettings().getDatum('byoyomiTimePerPeriod').value = SlowHourMinuteSecond.ofSeconds(10)
playerB.getSettings().getDatum('byoyomiTimePerPeriod').value = SlowHourMinuteSecond.ofSeconds(10)
playerB.getSettings().getDatum('byoyomiExtraTime').value = SlowHourMinuteSecond.ofSeconds(10)
playerB.getSettings().getDatum('byoyomiExtraTime').value = SlowHourMinuteSecond.ofSeconds(10)

const simulator = new Simulator(generalTwoPlayerGame)

simulator.start()