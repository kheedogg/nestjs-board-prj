import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
// import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
    // Repository 사용한 버전으로 변경하기 위해 주석처리
    
    // private boards: Board[] = [];
    
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}


    // getAllBoards(): Board[] {
    //     return this.boards;
    // }

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

        const board = this.boardRepository.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
        });

        await this.boardRepository.save(board)
        return board;
    }

    // getBoardById(id: string): Board {
    //     const found = this.boards.find(board => board.id === id);
    //     if (!found) {
    //         throw new NotFoundException(`Board with id ${id} not found`);
    //     }
    //     return found;
    // }

    async getBoardById(id: number): Promise<Board> {
        const found = await this.boardRepository.findOne({ where: { id } });

        if(!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }

        return found;
    }

    // deleteBoardById(id: string): void {
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

}
