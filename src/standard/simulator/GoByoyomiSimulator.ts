import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { GameClockSimulator } from '../../tool/GameSimulator'
import { StandardGameContainer } from '../StandardGameContainer'
import { GoByoyomiPlayer } from '../game/go/GoByoyomi'

const standardGameContainer = new StandardGameContainer()
const goGame = standardGameContainer.getGameSupplier('Go', 'Byoyomi')()

for (const role of goGame.roleArray) {
    const player: GoByoyomiPlayer = goGame.getPlayer(role)
    const settings = player.timeControl.settings
    settings.getSetting('main').value = SlowHourMinuteSecond.ofSeconds(15)
    settings.getSetting('timePerPeriod').value = SlowHourMinuteSecond.ofSeconds(10)
    settings.getSetting('periods').value = 3
}

new GameClockSimulator(goGame).start()