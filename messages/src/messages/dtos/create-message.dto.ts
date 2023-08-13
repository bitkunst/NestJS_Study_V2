import { IsString } from 'class-validator';
// class-validator : add a couple of validation rules to the class itself

export class CreateMessageDto {
    /**
     * @dev
     * class-validator is going to make sure that whenever we create an instance of create-message DTO,
     * we can make sure that the "content" property actually is a string
     */
    @IsString()
    content: string;
}
