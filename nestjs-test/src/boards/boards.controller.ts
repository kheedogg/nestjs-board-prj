import { Controller, Get, Post, Body, Param, Delete, Patch, ValidationPipe, ParseIntPipe, Query, UseGuards, Logger } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UsePipes } from '@nestjs/common';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    // Entity 사용한 버전으로 변경하기 위해 주석처리
    private logger = new Logger('BoardsController');
    constructor(private boardsService: BoardsService) {}

    // @Get()
    // getAllBoards(): Board[] {
    //     return this.boardsService.getAllBoards();
    // }
    @Get()
    getAllBoards(
        @GetUser() user: User
    ): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsService.getAllBoards(user);
    }

    // @Post()
    // @UsePipes(ValidationPipe)
    // createBoard(
    //     @Body() createBoardDto: CreateBoardDto,
    // ) {
    //     return this.boardsService.createBoard(createBoardDto);
    // }
    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User
    ): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto, user);
    }

    // @Get(':id')
    // getBoardById(
    //     @Param('id') id: string
    // ) {
    //     return this.boardsService.getBoardById(id) as Board;
    // }

    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        return this.boardsService.getBoardById(id)
    }

    // @Delete(':id')
    // deleteBoardById(
    //     @Param('id') id: string
    // ) {
    //     this.boardsService.deleteBoardById(id);
    // }
    @Delete('/:id')
    deleteBoardById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.boardsService.deleteBoardById(id, user);
    }

    // @Patch(':id/status')
    // updateBoardStatus(
    //     @Param('id') id: string,
    //     @Body('status', BoardStatusValidationPipe) status: BoardStatus
    // ) {
    //     return this.boardsService.updateBoardStatus(id, status);
    // }
    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Query('status', BoardStatusValidationPipe) status: BoardStatus
    ): Promise<Board> {
        return this.boardsService.updateBoardStatus(id, status);
    }

}
