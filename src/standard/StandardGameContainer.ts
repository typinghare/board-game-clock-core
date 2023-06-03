import { GameContainer } from '../GameContainer'
import { GoByoyomiPlayer, GoByoyomiTimeControl } from './game/go/GoByoyomi'
import { GoYingshiPlayer, GoYingshiTimeControl } from './game/go/GoYingshi'
import { GoGame } from './game/go/GoGame'
import { ChessGame } from './game/chess/ChessGame'
import { ChessStandardPlayer, ChessStandardTimeControl } from './game/chess/ChessStandard'

export type StandardGameType = 'Chess' | 'Go'

export type StandardGames = {
    'Chess': {
        Standard: () => ChessGame<ChessStandardTimeControl, ChessStandardPlayer>
    },
    'Go': {
        Byoyomi: () => GoGame<GoByoyomiTimeControl, GoByoyomiPlayer>,
        Yingshi: () => GoGame<GoYingshiTimeControl, GoYingshiPlayer>
    },
}

/**
 * Default game container.
 * @author James Chan
 */
export class StandardGameContainer extends GameContainer<StandardGameType, StandardGames> {
    protected override initializeGames(): StandardGames {
        return {
            'Chess': {
                Standard: () => new ChessGame(ChessStandardTimeControl, ChessStandardPlayer),
            },
            'Go': {
                Byoyomi: () => new GoGame(GoByoyomiTimeControl, GoByoyomiPlayer),
                Yingshi: () => new GoGame(GoYingshiTimeControl, GoYingshiPlayer),
            },
        }
    }
}