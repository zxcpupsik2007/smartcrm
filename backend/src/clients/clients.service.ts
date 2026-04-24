import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async findAll() {
    return this.clientRepository.find({ relations: ['assignedTo'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    return this.clientRepository.findOne({ where: { id }, relations: ['assignedTo'] });
  }

  async create(data: Partial<Client>) {
    const client = this.clientRepository.create(data);
    return this.clientRepository.save(client);
  }

  async update(id: number, data: Partial<Client>) {
    await this.clientRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.clientRepository.delete(id);
    return { deleted: true };
  }
}