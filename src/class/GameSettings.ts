import { Role } from '../types'
import { DataCollection } from '@typinghare/extrum'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import { Game } from './Game'
import { TimeControl } from './TimeControl'

/**
 * Default player settings. Each player has their own settings.
 */
export interface PlayerSettings {
    main: HourMinuteSecond
}

/**
 * Default advanced game settings.
 */
export interface AdvancedSettings {
}

type BoolSettingMetadata = {
    type: 'bool'
}

type NumberSettingMetadata = {
    type: 'number'
    options?: number[]
}

type TimeSettingMetadata = {
    type: 'time'
    options?: HourMinuteSecond[]
}

/**
 * Default setting metadata.
 */
export type SettingMetadata = {
    // The label of the setting
    label: string

    // The description of the setting
    description?: string
} & (BoolSettingMetadata | NumberSettingMetadata | TimeSettingMetadata)

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
     * Player role => player settings.
     * @private
     */
    private readonly playerSettings: Map<R, DataCollection<P>> = new Map()

    /**
     * Advanced game settings.
     * @private
     */
    private readonly advancedSettings: DataCollection<A>

    /**
     * Creates a settings.
     */
    constructor(
        game: Game<R, P, A, M>,
        timeControl: TimeControl<P>,
    ) {
        // Initialize player settings
        const roleArray: R[] = game.getRoleArray()
        roleArray.forEach(role => {
            this.playerSettings.set(role, timeControl.initializePlayerSettings())
        })

        // Initialize advanced settings
        this.advancedSettings = game.initializeAdvancedSettings()
    }

    /**
     * Returns advanced game settings.
     */
    getAdvancedSettings(): DataCollection<A> {
        return this.advancedSettings
    }

    /**
     * Returns a specified player's settings.
     * @param role The role of the player.
     */
    getPlayerSettings(role: R): DataCollection<P> {
        return this.playerSettings.get(role)!
    }
}