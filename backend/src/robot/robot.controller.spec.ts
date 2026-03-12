import { Test, TestingModule } from '@nestjs/testing';
import { RobotController } from './robot.controller';
import { RobotService } from './robot.service';

describe('RobotController', () => {
  let controller: RobotController;

  const mockRobotService = {
    create: jest.fn((dto) => {
      return { id: 1, ...dto }; 
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RobotController],
      providers: [
        {
          provide: RobotService,
          useValue: mockRobotService,
        },
      ],
    }).compile();

    controller = module.get<RobotController>(RobotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('test create robot', async () => {
    const newRobot = { x: 2, y: 3, direction: 0 };
    
    const result = await controller.create(newRobot as any);

    expect(result).toEqual({ id: 1, x: 2, y: 3, direction: 0 });
    expect(mockRobotService.create).toHaveBeenCalledWith(newRobot);
  });

  //TODO test list of actions

  //TODO test remove all 

  //TODO test creation of robot failure states: outside of bounds, invalid values, null types
});