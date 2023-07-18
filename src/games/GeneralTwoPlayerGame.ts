import { TwoPlayerGame } from './TwoPlayerGame'
import { AdvancedSettings, PlayerSettings } from '../class/GameSettings'

export interface TwoPlayerGamePlayerSettings extends PlayerSettings {

}

export interface TwoPlayerGameAdvancedSettings extends AdvancedSettings {

}

export class GeneralTwoPlayerGame extends TwoPlayerGame<
    TwoPlayerGamePlayerSettings,
    TwoPlayerGameAdvancedSettings
> {

}