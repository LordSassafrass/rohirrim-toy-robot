import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Robot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  direction: number;
}