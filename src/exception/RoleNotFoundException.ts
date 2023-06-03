import { Role } from '../types'

/**
 * Exception thrown when a role does not exist in the board game.
 * @author James Chan
 */
export class RoleNotFoundException extends Error {
    /**
     * Constructs a RoleNotFoundException with the specified role.
     * @param role The role that does not exist in the board game.
     */
    constructor(role: Role) {
        super(`Role does not exist in the board game: [ ${role.toString()} ].`)
    }
}