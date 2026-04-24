import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Client } from '../clients/client.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToOne(() => User)
  assignedTo: User;

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  @CreateDateColumn()
  createdAt: Date;
}