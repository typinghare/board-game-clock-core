import { Settings } from '@typinghare/settings'
import { Player } from './Player'
import { Game } from './Game'
import { TimeControl } from './TimeControl'

/**
 * Game settings.
 */
export type GameSettings = {}

/**
 * Time control settings.
 */
export type TimeControlSettings = {}

/**
 * Player properties.
 */
export type PlayerAttributes = Settings

/**
 * Player properties.
 */
export type PlayerAttributeProperties = {
    label: string
}

/**
 * The role.
 */
export type Role = string

/**
 * Game setting properties.
 */
export type GameSettingProperties<T = any> = {
    // The type of this setting.
    type: 'time' | 'text' | 'bool' | 'number',

    // The label for this setting.
    label: string,

    // The detailed description for this setting.
    description: string,

    // The options for the values of this setting.
    options?: T[]
}

/**
 * A class of creating a player.
 */
export type PlayerClass<
    T extends TimeControl<TS>,
    P extends Player<T, TS, PA, PP>,
    TS extends TimeControlSettings = any,
    PA extends PlayerAttributes = any,
    PP extends PlayerAttributeProperties = any,
> = new (role: Role, game: Game<any, T, P, TS, PA, PP>, timeControl: T) => P;

/**
 * A class of creating a time control.
 */
export type TimeControlClass<
    T extends TimeControl<TS>,
    TS extends TimeControlSettings = any,
> = new () => T;

/**
 * The callback function invoked when a clock runs out of time.
 */
export type ClockTimeUpCallback = (timeUpRole: Role) => void

/**
 * Interface for objects that can be converted to and from JSON objects.
 */
export interface JsonObjectEquivalent<T extends Object> {
    /**
     * Converts the object to a JSON object representation.
     * @returns The JSON object representation of the object.
     */
    toJsonObject(): T;

    /**
     * Restores the object's state from a JSON object representation.
     * @param jsonObject - The JSON object from which to restore the object's state.
     */
    fromJsonObject(jsonObject: T): void;
}

export type GameType = string

export type TimeControlType = string

export type GameSupplier<
    G extends GameSettings = any,
    T extends TimeControl<TS> = TimeControl,
    P extends Player<T, TS, PA, PP> = Player<T>,
    TS extends TimeControlSettings = any,
    PA extends PlayerAttributes = any,
    PP extends PlayerAttributeProperties = any,
> = () => Game<G, T, P, TS, PA, PP>

export type Games<GT extends GameType> = {
    [G in GT]: {
        [timeControl: string]: GameSupplier
    }
}