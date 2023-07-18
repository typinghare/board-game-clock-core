import { Role } from '../types'
import { DataCollection, DataMapping, Datum } from '@typinghare/extrum'
import { HourMinuteSecond, SlowHourMinuteSecond } from '@typinghare/hour-minute-second'

/**
 * Default player settings.
 */
export interface PlayerSettings {
    main: HourMinuteSecond
}

/**
 * Default advanced game settings.
 */
export interface AdvancedSettings {
}

/**
 * Default setting metadata.
 */
export interface SettingMetadata {
    type: 'bool' | 'number' | 'time'
    label: string
    description: string
    options?: (number | HourMinuteSecond)[]
}

type PlayerSettingsMap<R extends Role, P extends PlayerSettings> = {
    [role in R]: DataCollection<P>
}

/**
 * Game settings.
 */
export class GameSettings<
    R extends Role = Role,
    P extends PlayerSettings = PlayerSettings,
    A extends AdvancedSettings = AdvancedSettings,
    M extends SettingMetadata = SettingMetadata
> {
    /**
     * Advanced game settings.
     * @private
     */
    private readonly advancedSettings: DataCollection<A>

    /**
     * Player role => player settings.
     * @private
     */
    private readonly playerSettings: PlayerSettingsMap<R, P>

    /**
     * Creates a settings.
     * @param roleArray The role array.
     */
    constructor(roleArray: R[]) {
        this.advancedSettings = this.initializeAdvancedSettings()
        this.playerSettings = roleArray.map(() => {
            return this.initializePlayerSettings()
        }) as { [role in R]: DataCollection<P> }
    }

    /**
     * Returns advanced game settings.
     */
    getAdvancedSettings(): DataCollection {
        return this.advancedSettings
    }

    /**
     * Returns a specified player's settings.
     * @param role The role of the player.
     */
    getPlayerSettings(role: R) {
        return this.playerSettings[role]
    }

    /**
     * Initialize game settings.
     */
    protected initializeAdvancedSettings(): DataCollection<A> {
        return new DataCollection<A>({} as DataMapping<A>)
    }


}