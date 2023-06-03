import { SettingContainer } from '@typinghare/settings';
import { GameSettingProperties, JsonObjectEquivalent, TimeControlSettings } from './types';
export type TimeControlJsonObject = {
    settings: Record<string, any>;
};
/**
 * Abstract time control.
 * @param <TS> - Time control settings.
 * @author James Chan
 */
export declare abstract class TimeControl<TS extends TimeControlSettings = any> implements JsonObjectEquivalent<TimeControlJsonObject> {
    /**
     * Time control settings.
     * @private
     */
    protected readonly _settings: SettingContainer<TS, GameSettingProperties<any>>;
    /**
     * Returns this time control's settings.
     */
    get settings(): SettingContainer<TS, GameSettingProperties>;
    /**
     * Creates a time control.
     * @protected
     */
    constructor();
    /**
     * Initializes settings for this time control.
     * @protected
     */
    protected initializeSettings(): void;
    toJsonObject(): TimeControlJsonObject;
    fromJsonObject(jsonObject: TimeControlJsonObject): void;
}
