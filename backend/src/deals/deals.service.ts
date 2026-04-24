import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deal.entity';
import OpenAI from 'openai';

@Injectable()
export class DealsService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
  ) {}

  async findAll() {
    return this.dealRepository.find({ relations: ['client', 'assignedTo'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    return this.dealRepository.findOne({ where: { id }, relations: ['client', 'assignedTo'] });
  }

  async create(data: Partial<Deal>) {
    const deal = this.dealRepository.create(data);
    const saved = await this.dealRepository.save(deal);
    await this.analyzeWithAI(saved.id);
    return this.findOne(saved.id);
  }

  async update(id: number, data: Partial<Deal>) {
    await this.dealRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.dealRepository.delete(id);
    return { deleted: true };
  }

  async analyzeWithAI(id: number) {
    const deal = await this.findOne(id);
    if (!deal) return;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a CRM AI assistant. Analyze this deal and return ONLY a JSON object with:
          score (1-10, probability to close), suggestion (one actionable next step, max 100 chars).
          Return only JSON, no markdown.`,
        },
        {
          role: 'user',
          content: `Deal: ${deal.title}, Stage: ${deal.stage}, Amount: ${deal.amount}, Client: ${deal.client?.name}`,
        },
      ],
    });

    const raw = response.choices[0].message.content!;
    const parsed = JSON.parse(raw);
    await this.dealRepository.update(id, { aiScore: parsed.score, aiSuggestion: parsed.suggestion });
  }
}