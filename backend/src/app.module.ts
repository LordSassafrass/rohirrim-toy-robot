import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotModule } from './robot/robot.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/database.sqlite',
      
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      
      synchronize: true, 
    }),
    RobotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}