import { DataCollection, DataMapping, Datum } from '@typinghare/extrum'
import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { PlayerSettings, SettingMetadata } from './GameSettings'

export class TimeControl<
    P extends PlayerSettings = PlayerSettings,
    M extends SettingMetadata = SettingMetadata
> {
    /**
     * Initializes player settings.
     */
    initializePlayerSettings(): DataCollection<P, M> {
        return new DataCollection<P, M>({
            main: new Datum<PlayerSettings['main'], SettingMetadata>(SlowHourMinuteSecond.ofMinutes(10), {
                type: 'time',
                label: 'Main',
                description: 'The main time.',
            }),
        } as DataMapping<P, M>)
    }

    /**
     * Set displayed player settings.
     */
    setDisplayedPlayerSettings(): string[] {
        return ['main']
    }
}