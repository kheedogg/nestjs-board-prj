import { Controller, Get, Post, Body, Param, Delete, Patch, ValidationPipe, ParseIntPipe, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UsePipes } from '@nestjs/common';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
export class BoardsController {
    // Entity 사용한 버전으로 변경하기 위해 주석처리
    constructor(private boardsService: BoardsService) {}

    // @Get()
    // getAllBoards(): Board[] {
    //     return this.boardsService.getAllBoards();
    // }
    @Get()
    getAllBoards(): Promise<Board[]> {
        return this.boardsService.getAllBoards();
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
    createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto);
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
    deleteBoardById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.boardsService.deleteBoardById(id);
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
