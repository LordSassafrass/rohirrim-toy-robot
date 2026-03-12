import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';
import { Robot } from './robot.entity';

@Module({
  // Register the entity here so it can be injected into the service
  imports: [TypeOrmModule.forFeature([Robot])],
  providers: [RobotService],
  controllers: [RobotController],
})
export class RobotModule {}