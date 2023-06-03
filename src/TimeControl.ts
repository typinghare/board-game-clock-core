import { SettingContainer } from '@typinghare/settings'
import { GameSettingProperties, JsonObjectEquivalent, TimeControlSettings } from './types'

/**
 * Abstract time control.
 * @param <TS> - Time control settings.
 * @author James Chan
 */
export abstract class TimeControl<
    TS extends TimeControlSettings = any
> implements JsonObjectEquivalent<any> {

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

    toJsonObject(): object {
        const object = {}
        for (const [name, setting] of Object.entries(this._settings.getSettings() as object)) {
            // @ts-ignore
            object[name] = setting.value
        }

        return object
    }

    fromJsonObject(jsonObject: object): void {
        for (const [name, settingValue] of Object.entries(jsonObject)) {
            // @ts-ignore
            this._settings.getSetting(name).value = settingValue
        }
    }
}