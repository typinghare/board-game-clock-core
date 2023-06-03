import { StandardGameContainer } from '../src/standard/StandardGameContainer'
import { StandardGameHolder } from '../src/standard/StandardGameHolder'
import { GoByoyomiClockControllerJsonObject, GoByoyomiPlayer } from '../src/standard/game/go/GoByoyomi'
import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'

describe('Standard game holder tests.', function(): void {
    const standardGameContainer = new StandardGameContainer()
    const goGame = standardGameContainer.getGameSupplier('Go', 'Byoyomi')()
    const standardGameHolder = new StandardGameHolder('Go', 'Byoyomi', goGame)

    // Modify game.
    goGame.start()
    const playerA: GoByoyomiPlayer = goGame.getPlayer('A')
    playerA.timeControl.settings.getSetting('main').value = SlowHourMinuteSecond.ofMinutes(3)
    goGame.getPlayer('B').click()
    setTimeout((): void => {
        goGame.stop()
    }, 1000)

    const standardGameHolderJsonObject = standardGameHolder.toJsonObject()

    it('Test game type and time control type.', function(): void {
        expect(standardGameHolderJsonObject.gameType).toBe('Go')
        expect(standardGameHolderJsonObject.timeControlType).toBe('Byoyomi')
    })

    it('Test game settings.', function(): void {
        const gameSettings = standardGameHolderJsonObject.game.settings
        expect(gameSettings.sync).toBe(true)
    })

    it('Test players.', function(): void {
        const playerA = standardGameHolderJsonObject.game.playerArray[0]

        // time control
        const playerATimeControl = playerA.timeControl
        expect(playerATimeControl.settings.periods).toBe(3)

        // clock controller
        const playerAClockController = playerA.clockController! as GoByoyomiClockControllerJsonObject
        expect(playerAClockController.remainingPeriods).toBe(3)
        expect(playerAClockController.isEnterByoyomi).toBe(false)
        expect(playerAClockController.clock.isRunning).toBe(true)
    })

    // From Json.
    const standardGameHolder2 = new StandardGameHolder(standardGameHolderJsonObject)
    const goGame2 = standardGameHolder2.game

    it('Test game type and time control type.', function() {
        expect(standardGameHolder2.gameType).toBe('Go')
        expect(standardGameHolder2.timeControlType).toBe('Byoyomi')
    })

    it('Test time control settings.', function(): void {
        const playerA = goGame2.getPlayer('A') as GoByoyomiPlayer
        const mainTime = playerA.timeControl.settings.getSettings().main
        expect(mainTime.value.ms).toBe(180000)
    })
})