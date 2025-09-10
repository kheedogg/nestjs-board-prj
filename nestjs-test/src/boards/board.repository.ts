import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';

@Injectable()
export class BoardRepository {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    // Create
    async create(data: Partial<Board>): Promise<Board> {
        const board = this.boardRepository.create(data);
        return await this.boardRepository.save(board);
    }

    // Read
    async findOneById(id: number): Promise<Board | null> {
        return await this.boardRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Board[]> {
        return await this.boardRepository.find();
    }

    // Update
    async updateStatusById(id: number, status: BoardStatus): Promise<any> {
        return await this.boardRepository.update(id, { status });
    }

    // Delete
    async deleteById(id: number): Promise<any> {
        const result = await this.boardRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return;
    }
}
