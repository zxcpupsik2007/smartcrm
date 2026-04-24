import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Client } from '../clients/client.entity';
import { User } from '../users/user.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', nullable: true })
  amount: number;

  @Column({ default: 'new' })
  stage: string;

  @Column({ nullable: true })
  aiScore: number;

  @Column({ nullable: true, type: 'text' })
  aiSuggestion: string;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => User)
  assignedTo: User;

  @CreateDateColumn()
  createdAt: Date;
}