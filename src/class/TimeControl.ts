import { DataCollection, DataMapping, Datum } from '@typinghare/extrum'
import { SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { PlayerSettings, SettingMetadata } from './GameSettings'

export type TimeControlClass = new (...args: ConstructorParameters<typeof TimeControl>) => TimeControl

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
                description: 'Main time.',
            }),
        } as DataMapping<P>)
    }
}