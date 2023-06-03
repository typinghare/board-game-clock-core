import { SettingContainer } from '@typinghare/settings';
import { GameSettingProperties, TimeControlSettings } from './types';
/**
 * Abstract time control.
 * @param <TS> - Time control settings.
 * @author James Chan
 */
export declare abstract class TimeControl<TS extends TimeControlSettings = any> {
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
}
