import { StandardGameContainer } from '../src/standard/StandardGameContainer'

describe('Standard game container tests.', function(): void {
    const standardGameContainer = new StandardGameContainer()

    it('Test getGameTypes().', function(): void {
        const gameTypes = standardGameContainer.getGameTypes()
        expect(gameTypes).toContain('Chess')
        expect(gameTypes).toContain('Go')
    })

    it('Test getTimeControls().', function(): void {
        const goTimeControls = standardGameContainer.getTimeControls('Go')
        expect(goTimeControls).toContain('Byoyomi')
        expect(goTimeControls).toContain('Yingshi')
    })
})