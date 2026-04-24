import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll() {
    return this.taskRepository.find({ relations: ['assignedTo', 'client'], order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Task>) {
    const task = this.taskRepository.create(data);
    return this.taskRepository.save(task);
  }

  async update(id: number, data: Partial<Task>) {
    await this.taskRepository.update(id, data);
    return this.taskRepository.findOne({ where: { id }, relations: ['assignedTo', 'client'] });
  }

  async remove(id: number) {
    await this.taskRepository.delete(id);
    return { deleted: true };
  }
}