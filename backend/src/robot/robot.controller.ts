import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { RobotService } from './robot.service';
import { Robot } from './robot.entity';

// The string 'robots' here defines the base route: http://localhost:3000/robots
@Controller('robots')
export class RobotController {
  // Inject the RobotService so we can call its database methods
  constructor(private readonly robotService: RobotService) {}

  // Route: GET /robots
  @Get()
  findAll(): Promise<Robot[]> {
    return this.robotService.findAll();
  }

  // Route: POST /robots
  @Post()
  create(@Body() robot: Partial<Robot>): Promise<Robot> {
    let x_bound = robot.x != null && typeof robot.x == 'number' && robot.x >= 0 && robot.x < 5; 
    let y_bound = robot.y != null && typeof robot.y == 'number' && robot.y >= 0 && robot.y < 5; 
    let dir_bound = robot.direction != null && typeof robot.direction == 'number' && robot.direction >= 0 && robot.direction < 4; 
    if (x_bound && y_bound && dir_bound)
    {
        return this.robotService.create(robot);
    }
    else
    {
        throw new BadRequestException('Robot is not in a valid position');
    }
  }

  // Route: DELETE /robots
  @Delete()
  removeAll(): Promise<void> {
    return this.robotService.removeAll();
  }
}