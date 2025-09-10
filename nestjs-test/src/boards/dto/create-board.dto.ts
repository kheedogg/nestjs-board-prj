import { IsNotEmpty } from 'class-validator';
import { BoardStatus } from '../board-status.enum';
import { Validate } from 'class-validator';
import { BoardStatusValidationPipe } from '../pipes/board-status-validation.pipe';

export class CreateBoardDto {
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description: string;
}
