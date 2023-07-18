import { Role } from '../types'
import { DataCollection } from '@typinghare/extrum'
import { HourMinuteSecond } from '@typinghare/hour-minute-second'
import { Game } from './Game'

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
     * Player settings to displayed.
     * @private
     */
    private readonly displayedPlayerSettings: (keyof P)[]

    /**
     * Advanced game settings to displayed.
     * @private
     */
    private readonly displayedAdvancedSettings: (keyof A)[]

    /**
     * Creates a settings.
     */
    constructor(
        game: Game<R, P, A, M>,
    ) {
        // Initialize player settings
        const roleList: R[] = game.getRoleList()
        const timeControl = game.getTimeControl()
        roleList.forEach(role => this.playerSettings.set(role, timeControl.initializePlayerSettings()))
        this.displayedPlayerSettings = timeControl.setDisplayedPlayerSettings()

        // Initialize advanced settings
        this.advancedSettings = game.initializeAdvancedSettings()
        this.displayedAdvancedSettings = [] as (keyof A)[]
    }

    /**
     * Returns a specified player's settings.
     * @param role The role of the player.
     */
    getPlayerSettings(role: R): DataCollection<P> {
        return this.playerSettings.get(role)!
    }

    /**
     * Returns advanced game settings.
     */
    getAdvancedSettings(): DataCollection<A> {
        return this.advancedSettings
    }

    /**
     * Returns player settings to display.
     */
    getDisplayedPlayerSettings(): (keyof P)[] {
        return this.displayedPlayerSettings
    }

    /**
     * Returns advanced game settings to display.
     */
    getDisplayedAdvancedSettings(): (keyof A)[] {
        return this.displayedAdvancedSettings
    }
}