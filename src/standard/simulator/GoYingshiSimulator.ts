import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { GameClockSimulator } from '../../tool/GameSimulator'
import { GoYingshiPlayer } from '../game/go/GoYingshi'
import { StandardGameContainer } from '../StandardGameContainer'

const standardGameContainer = new StandardGameContainer()
const goGame = standardGameContainer.getGameSupplier('Go', 'Yingshi')()

for (const role of goGame.roleArray) {
    const player: GoYingshiPlayer = goGame.getPlayer(role)
    const settings = player.timeControl.settings
    settings.getSetting('main').value = SlowHourMinuteSecond.ofSeconds(15)
    settings.getSetting('penaltyTime').value = SlowHourMinuteSecond.ofSeconds(10)
    settings.getSetting('maxPenalties').value = 2
}

new GameClockSimulator(goGame).start()