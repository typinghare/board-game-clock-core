import { PlayerAttributeProperties, PlayerAttributes, TimeControlSettings } from '../../../types'
import { TimeControl } from '../../../TimeControl'
import { Player } from '../../../Player'
import { TwoPlayerGame } from '../../../stereotype/TwoPlayerGame'
import { StandardGameSettings } from '../../types'

export type GoGameSettings = StandardGameSettings & {}

export class GoGame<
    T extends TimeControl<TS>,
    P extends Player<T, TS, PA, PP>,
    TS extends TimeControlSettings = any,
    PA extends PlayerAttributes = any,
    PP extends PlayerAttributeProperties = any,
> extends TwoPlayerGame<GoGameSettings, T, P, TS, PA, PP> {
    protected override initializeSettings(): void {
        this.settings.addSetting('synchronizePlayerSettings', true, {
            type: 'bool',
            label: 'Synchronize Player Settings',
            description: 'When activated, the settings of two players will be synchronized.',
        })
    }
}
