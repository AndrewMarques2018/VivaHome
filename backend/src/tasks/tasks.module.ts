import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [TasksService],
})
export class TasksModule {}
