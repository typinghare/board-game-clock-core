import { SettingContainer } from '@typinghare/settings'
import { GameSettingProperties, JsonObjectEquivalent, TimeControlSettings } from './types'

export type TimeControlJsonObject = {
    settings: Record<string, any>
}

/**
 * Abstract time control.
 * @param <TS> - Time control settings.
 * @author James Chan
 */
export abstract class TimeControl<
    TS extends TimeControlSettings = any
> implements JsonObjectEquivalent<TimeControlJsonObject> {

    /**
     * Time control settings.
     * @private
     */
    protected readonly _settings = new SettingContainer<TS, GameSettingProperties>()

    /**
     * Returns this time control's settings.
     */
    get settings(): SettingContainer<TS, GameSettingProperties> {
        return this._settings
    }

    /**
     * Creates a time control.
     * @protected
     */
    public constructor() {
        this.initializeSettings()
    }

    /**
     * Initializes settings for this time control.
     * @protected
     */
    protected initializeSettings(): void {
    }

    toJsonObject(): TimeControlJsonObject {
        const settings = {}
        for (const [name, setting] of Object.entries(this._settings.getSettings() as object)) {
            // @ts-ignore
            settings[name] = setting.value
        }

        return { settings }
    }

    fromJsonObject(jsonObject: TimeControlJsonObject): void {
        const { settings } = jsonObject

        for (const [name, settingValue] of Object.entries(settings)) {
            // @ts-ignore
            this._settings.getSetting(name).value = settingValue
        }
    }
}