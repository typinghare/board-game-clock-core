import { GameClockSimulator } from '../../tool/GameSimulator'
import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { StandardGameContainer, StandardGames } from '../StandardGameContainer'

const standardGameContainer = new StandardGameContainer()
const chessGame: ReturnType<StandardGames['Chess']['Standard']> = standardGameContainer.getGameSupplier('Chess', 'Standard')()

for (const role of chessGame.roleArray) {
    const player = chessGame.getPlayer(role)
    const settings = player.timeControl.settings
    settings.getSetting('main').value = SlowHourMinuteSecond.ofSeconds(20)
    settings.getSetting('timeIncrement').value = SlowHourMinuteSecond.ofSeconds(5)
}

new GameClockSimulator(chessGame).start()