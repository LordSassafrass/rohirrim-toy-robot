import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from './robot.entity';

@Injectable()
export class RobotService {
  constructor(
    @InjectRepository(Robot)
    private robotsRepository: Repository<Robot>,
  ) {}

  // Get all robots
  findAll(): Promise<Robot[]> {
    return this.robotsRepository.find();
  }
  create(robot: Partial<Robot>): Promise<Robot> {
    const newRobot = this.robotsRepository.create(robot);
    return this.robotsRepository.save(newRobot);
  }

  async removeAll(): Promise<void> {
    await this.robotsRepository.clear(); // .clear() safely truncates the table
  }
}