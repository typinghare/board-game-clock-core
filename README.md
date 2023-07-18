# Board Game Clock Core

## Get Started

### Create a game

~~~typescript
import { Game, Player, TimeControl } from '@typinghare/board-game-clock-core'

const ROLE_A = 'A'
const ROLE_B = 'B'

// Create a game with two players (A & B), applying default time control and default player
const game = new Game([ROLE_A, ROLE_B], new TimeControl(), Player)

// Start the game
game.start()

// Get players
const playerA = game.getPlayer(ROLE_A)
const playerB = game.getPlayer(ROLE_B)

// Player A presses, player B's timer runs
playerA.press()

// Set onStop callback function
game.onStop = function(stopper, timeUpRole) {
    console.log(`Game stops. Player ${stopper} stops the game.`)
    if (timeUpRole) {
        console.log(`Player ${timeUpRole} has run out of time.`)
    }
}

// Stop the game
game.stop()
~~~

### Two-Player Game

~~~typescript
import { Player, TimeControl, TwoPlayerGame } from '@typinghare/board-game-clock-core'

// Create a two-player game
const game = new TwoPlayerGame(new TimeControl(), Player)
~~~

### Use General Two-player Game

~~~typescript

~~~

## Use Simulator

## Customize a New Game