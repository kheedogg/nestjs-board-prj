import { Controller, Get, Post, Body, Param, Delete, Patch, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board, BoardStatus } from './boards.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UsePipes } from '@nestjs/common';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
export class BoardsController {
    
    constructor(private boardsService: BoardsService) {}

    @Get()
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
    ) {
        return this.boardsService.createBoard(createBoardDto);
    }

    @Get(':id')
    getBoardById(
        @Param('id') id: string
    ) {
        return this.boardsService.getBoardById(id) as Board;
    }

    @Delete(':id')
    deleteBoardById(
        @Param('id') id: string
    ) {
        this.boardsService.deleteBoardById(id);
    }

    @Patch(':id/status')
    updateBoardStatus(
        @Param('id') id: string,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }

}
