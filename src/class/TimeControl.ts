import { DataCollection, DataMapping, Datum } from '@typinghare/extrum'
import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { PlayerSettings, SettingMetadata } from './GameSettings'

export class TimeControl<
    P extends PlayerSettings = PlayerSettings,
> {
    /**
     * Initializes player settings.
     */
    initializePlayerSettings(): DataCollection<P> {
        return new DataCollection<P>({
            main: new Datum<PlayerSettings['main'], SettingMetadata>(SlowHourMinuteSecond.ofMinutes(10), {
                type: 'time',
                label: 'Main',
                description: 'The main time.',
            }),
        } as DataMapping<P>)
    }

    /**
     * Set displayed player settings.
     */
    setDisplayedPlayerSettings(): (keyof P)[] {
        return ['main']
    }
}