import { TwoPlayerGame } from './TwoPlayerGame'
import { AdvancedSettings, SettingMetadata } from '../class/GameSettings'
import { Role } from '../types'
import { TimeControl } from '../class/TimeControl'
import { AttributeMetadata, Player } from '../class/Player'
import { HourMinuteSecond, SlowHourMinuteSecond } from '@typinghare/hour-minute-second'
import { DataCollection, Datum } from '@typinghare/extrum'
import { TimerController } from '../class/TimerController'
import { Timer } from '../class/Timer'

export type TwoPlayerGamePlayerSettings = {
    // Main time.
    main: HourMinuteSecond
} & TwoPlayerGamePlayerTimeBonusSettings & TwoPlayerGamePlayerByoyomiSettings

export interface TwoPlayerGamePlayerTimeBonusSettings {
    // Whether to enable time bonus.
    enableTimeBonus: boolean

    // The player will receive a time bonus added to the main time if the time used in a turn which is longer than this
    // property value.
    timeBonusBasedTurnTime: HourMinuteSecond

    // Time bonus.
    timeBonus: HourMinuteSecond
}

export interface TwoPlayerGamePlayerByoyomiSettings {
    // Whether to enable byoyomi.
    enableByoyomi: boolean

    // Time per period.
    byoyomiTimePerPeriod: HourMinuteSecond

    // The number of byoyomi periods.
    byoyomiPeriods: number

    // Extra time when a byoyomi period is used.
    byoyomiExtraTime: HourMinuteSecond
}

export interface TwoPlayerGameAdvancedSettings extends AdvancedSettings {
}

export class GeneralTwoPlayerGame extends TwoPlayerGame<
    TwoPlayerGamePlayerSettings,
    TwoPlayerGameAdvancedSettings
> {
    constructor(
        roleList: [Role, Role] = [TwoPlayerGame.ROLE_A, TwoPlayerGame.ROLE_B],
    ) {
        super(
            new GeneralTwoPlayerGameTimeControl(),
            GeneralTwoPlayerGamePlayer,
            roleList,
        )
    }
}

export class GeneralTwoPlayerGameTimeControl extends TimeControl<TwoPlayerGamePlayerSettings> {
    override initializePlayerSettings(): DataCollection<TwoPlayerGamePlayerSettings, SettingMetadata> {
        return new DataCollection<TwoPlayerGamePlayerSettings, SettingMetadata>({
            main: new Datum(SlowHourMinuteSecond.ofSeconds(10), {
                type: 'time',
                label: 'Main Time',
                description: '',
            }),

            enableTimeBonus: new Datum(false, {
                type: 'boolean',
                label: 'Enable Time Bonus',
                description: '',
            }),
            timeBonusBasedTurnTime: new Datum(SlowHourMinuteSecond.ofSeconds(10), {
                type: 'time',
                label: 'Time Bonus Based Turn Time',
                description: '',
            }),
            timeBonus: new Datum(SlowHourMinuteSecond.ofSeconds(10), {
                type: 'time',
                label: 'Time Bonus',
                description: '',
            }),

            enableByoyomi: new Datum(false, {
                type: 'boolean',
                label: 'Enable Byoyomi',
                description: '',
            }),
            byoyomiTimePerPeriod: new Datum(SlowHourMinuteSecond.ofSeconds(30), {
                type: 'time',
                label: 'Byoyomi Time Per Period',
                description: '',
            }),
            byoyomiPeriods: new Datum(3, {
                type: 'number',
                label: 'Byoyomi Periods',
                description: '',
            }),
            byoyomiExtraTime: new Datum(SlowHourMinuteSecond.ofSeconds(0), {
                type: 'time',
                label: 'Byoyomi Extra Time',
                description: '',
            }),
        })
    }

    override setDisplayedPlayerSettings(): string[] {
        return [
            'main',

            'enableTimeBonus',
            'timeBonusBasedTurnTime',
            'timeBonus',

            'enableByoyomi',
            'byoyomiTimePerPeriod',
            'byoyomiPeriods',
            'byoyomiExtraTime',
        ]
    }
}

export interface GeneralTwoPlayerGamePlayerAttribute {
    remainingByoyomiPeriods: number
}

export class GeneralTwoPlayerGamePlayer extends Player<TwoPlayerGamePlayerSettings, GeneralTwoPlayerGamePlayerAttribute, AttributeMetadata> {
    constructor(
        protected game: GeneralTwoPlayerGame,
        protected role: Role,
    ) {
        super(game, role)
    }

    protected override createTimerController(): GeneralTwoPlayerGameTimerController {
        return new GeneralTwoPlayerGameTimerController(this)
    }

    protected override initializeAttributes(): DataCollection<GeneralTwoPlayerGamePlayerAttribute, AttributeMetadata> {
        const remainingByoyomiPeriods: number = this.getSettings().getDatum('byoyomiPeriods').value

        return new DataCollection<GeneralTwoPlayerGamePlayerAttribute, AttributeMetadata>({
            remainingByoyomiPeriods: new Datum(remainingByoyomiPeriods, { label: 'Remaining Byoyomi Periods' }),
        })
    }

    protected override updateAttributes(): void {
        const timerController = this.getTimerController() as GeneralTwoPlayerGameTimerController

        this.attributes.getDatum('remainingByoyomiPeriods').value = timerController.getRemainingPeriods()!
    }
}

export class GeneralTwoPlayerGameTimerController extends TimerController<TwoPlayerGamePlayerSettings> {
    private turnStartTimestamp?: number

    private remainingPeriods?: number

    private hasEnteredByoyomi?: boolean = false

    protected override createTimer(): Timer {
        const playerSettings: DataCollection<TwoPlayerGamePlayerSettings> = this.player.getSettings()
        const mainTime: HourMinuteSecond = playerSettings.getValue('main')

        const enableTimeBonus: boolean = playerSettings.getValue('enableTimeBonus')
        const timeBonusBasedTurnTime: HourMinuteSecond = playerSettings.getValue('timeBonusBasedTurnTime')
        const timeBonus: HourMinuteSecond = playerSettings.getValue('timeBonus')

        const enableByoyomi: boolean = playerSettings.getValue('enableByoyomi')
        const byoyomiPeriods: number = playerSettings.getValue('byoyomiPeriods')
        const byoyomiTimePerPeriod: HourMinuteSecond = playerSettings.getValue('byoyomiTimePerPeriod')
        const byoyomiExtraTime: HourMinuteSecond = playerSettings.getValue('byoyomiExtraTime')
        this.remainingPeriods = byoyomiPeriods

        const timerController = this

        const timer = new Timer(mainTime, function() {
            // Byoyomi
            if (enableByoyomi) {
                if (timerController.hasEnteredByoyomi) {
                    if (timerController.remainingPeriods) {
                        if (timerController.remainingPeriods > 1) {
                            timerController.remainingPeriods!--
                            this.time = byoyomiTimePerPeriod.clone().extend(byoyomiExtraTime.ms)

                            return this.resume()
                        }
                    }
                } else {
                    timerController.hasEnteredByoyomi = true
                    this.time = byoyomiTimePerPeriod

                    return this.resume()
                }
            }

            timerController.timerEnd()
        })

        timer.onBeforeResume = function() {
            if (enableTimeBonus) {
                timerController.turnStartTimestamp = new Date().getTime()
            }

            if (enableByoyomi) {
                if (timerController.hasEnteredByoyomi) {
                    // Restore time
                    this.time = byoyomiTimePerPeriod
                }
            }
        }

        timer.onBeforePause = function() {
            if (enableTimeBonus && timerController.turnStartTimestamp) {
                const turnTimeInMs: number = (new Date().getTime()) - timerController.turnStartTimestamp
                if (turnTimeInMs > timeBonusBasedTurnTime.ms) {
                    // Add the bonus time to the main time
                    this.getTimePrototype().extend(timeBonus)
                }
            }
        }

        return timer
    }

    getRemainingPeriods(): number | undefined {
        return this.remainingPeriods
    }
}