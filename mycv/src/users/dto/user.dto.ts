// Expose : do share this property
// Exclude : do not try to share this property
import { Expose, Exclude } from 'class-transformer';

/**
 * @dev
 * Not going to add in any validation to the DTO because we don't really need to validate outgoing data
 */
export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;
}
