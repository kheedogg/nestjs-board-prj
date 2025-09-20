import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

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

    async findAll(user: User): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');
        query.where('board.userId = :userId', { userId: user.id });
        const boards = await query.getMany();
        return boards;
    }

    // Update
    async updateStatusById(id: number, status: BoardStatus): Promise<any> {
        return await this.boardRepository.update(id, { status });
    }

    // Delete
    async deleteById(id: number, user: User): Promise<any> {
        const result = await this.boardRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return;
    }
}
