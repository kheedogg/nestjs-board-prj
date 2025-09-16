import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
// import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardsService {
    
    constructor(
        private boardRepository: BoardRepository,
        // @InjectRepository(BoardRepository)
        // private boardRepository: BoardRepository,
    ) {}

    async getAllBoards(): Promise<Board[]> {
        return await this.boardRepository.findAll();
    }

    // createBoard(createBoardDto: CreateBoardDto): Board {
    //     const {title, description} = createBoardDto;
    //     const board: Board = {  
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC,
    //     };
    //     this.boards.push(board);
    //     return board;
    // }

    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        const {title, description} = createBoardDto;

        return await this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
        });
    }

    // getBoardById(id: string): Board {
    //     const found = this.boards.find(board => board.id === id);
    //     if (!found) {
    //         throw new NotFoundException(`Board with id ${id} not found`);
    //     }
    //     return found;
    // }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOneById(id);

        if(!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }

        return found;
    }

    // deleteBoardById(id: string): void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }

    async deleteBoardById(id: number): Promise<void> {
        await this.boardRepository.deleteById(id);
    }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);
        await this.boardRepository.updateStatusById(id, status);
        board.status = status;
        return board;
    }

}
