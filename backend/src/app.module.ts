import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { DealsModule } from './deals/deals.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Client } from './clients/client.entity';
import { Deal } from './deals/deal.entity';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'smartcrm',
      entities: [User, Client, Deal, Task],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    DealsModule,
    TasksModule,
  ],
})
export class AppModule { }