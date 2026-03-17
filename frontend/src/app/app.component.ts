import { Component, inject, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Robot } from '../models/robot/robot.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; font-family: sans-serif; max-width: 400px; margin: 0 auto; text-align: center;">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h1 style="margin: 0;">Toy Robot</h1>
        <button (click)="clearRobots()" style="color: red; padding: 0.5rem 1rem; cursor: pointer;">Clear</button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; background: #555; border: 4px solid #555; border-radius: 4px; margin-bottom: 2rem;">
        <div *ngFor="let cell of gridCells; let i = index" 
            (click)="onTileClick(i)"
            style="aspect-ratio: 1; background: white; display: flex; justify-content: center; align-items: center; cursor: pointer; border: 1px solid #ccc;">
            
            <img *ngIf="cell === 'X'" 
                  [src]="getRobotImage()" 
                  style="width: 80%; height: 80%; display: block;" 
                  alt="robot">
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 1rem;">
        <button (click)="turnLeft()" style="padding: 0.5rem 1rem; cursor: pointer;">Left</button>
        <button (click)="move()" style="padding: 0.5rem 1rem; cursor: pointer;">Move</button>
        <button (click)="turnRight()" style="padding: 0.5rem 1rem; cursor: pointer;">Right</button>
      </div>

      <div>
        <button (click)="report()" style="padding: 0.5rem 2rem; cursor: pointer; font-weight: bold;">Report</button>
      </div>

      <div style="background: #f4f4f4; padding: 1rem; border-radius: 8px; margin-top: 2rem; text-align: left;">
        <h3>Database Output:</h3>
        <pre>{{ robotOutput }}</pre>
      </div>
      
    </div>
  `
})
export class AppComponent {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  
  private apiUrl = 'http://127.0.0.1:3000/robots';
  
  public robot : Robot | null = null;
  public robotOutput : string = ""

  gridCells: string[] = new Array(25).fill('');

  private robotImages: Record<number, string> = {
    0: 'assets/images/robot-north.png',
    1: 'assets/images/robot-east.png',
    2: 'assets/images/robot-south.png',
    3: 'assets/images/robot-west.png'
  };

  ngOnInit() {
    this.getRobots();
  }

  onTileClick(index: number) {
    this.gridCells.fill('');
    this.gridCells[index] = 'X';

    const x = index % 5;
    const y = Math.abs(4 - Math.floor(index / 5)) % 5;

    this.createRobot(x, y, 0);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'arrowup':
      case 'w':
        this.move();
        break;
      case 'arrowleft':
      case 'a':
        this.turnLeft();
        break;
      case 'arrowright':
      case 'd':
        this.turnRight();
        break;
      case 'arrowdown':
      case 's':
        this.report()
        break;
    }
  }

  getRobotImage(): string {
    if (this.robot && this.robot.direction !== undefined) {
      return this.robotImages[this.robot.direction];
    }
    return 'assets/robot-north.png'; 
  }

  turnLeft() {
    console.log('Action: LEFT');
    if (this.robot != null)
    {
      this.robot.direction = (this.robot.direction + 3) % 4;
      this.updateRobot(this.robot);
    }
  }

  turnRight() {
    console.log('Action: RIGHT');
    if (this.robot != null)
    {
      this.robot.direction = (this.robot.direction + 1) % 4;
      this.updateRobot(this.robot);
    }
  }

  move() {
    console.log('Action: MOVE');
    if (this.robot != null)
    {
      switch (this.robot.direction)
      {
        case 0: {
          let new_y = this.robot.y + 1
          if (new_y >= 0 && new_y < 5)
          {
            this.robot.y = new_y
            this.updateRobot(this.robot)
          }
          break;
        }
        case 1: {
          let new_x = this.robot.x + 1
          if (new_x >= 0 && new_x < 5)
          {
            this.robot.x = new_x
            this.updateRobot(this.robot)
          }
          break;
        }
        case 2: {
          let new_y = this.robot.y - 1
          if (new_y >= 0 && new_y < 5)
          {
            this.robot.y = new_y
            this.updateRobot(this.robot)
          }
          break;
        }
        case 3: {
          let new_x = this.robot.x - 1
          if (new_x >= 0 && new_x < 5)
          {
            this.robot.x = new_x
            this.updateRobot(this.robot)
          }
          break;
        }
        default:
          console.log("Robot has unknown direction.")
      }
      this.gridCells.fill('');
      let index = this.robot.x + (4 - this.robot.y) * 5
      this.gridCells[index] = 'X';
    }
  }

  report() {
    console.log('Action: REPORT');
    if (this.robot != null){
      this.robotOutput = `Output: ${this.robot.x},${this.robot.y},${this.robot?.direction}`
    } else {
      this.robotOutput = ""
    }
  }

  createRobot(x: number, y: number, dir: number) {
    const newRobot = {
      x: x,
      y: y,
      direction: dir
    };

    this.robot = newRobot;

    this.http.post(this.apiUrl, newRobot).subscribe({
      next: () => {
        console.log(`Robot created at [${x}, ${y}]!`);
      },
      error: (err) => console.error('Error creating robot:', err)
    });
  }

  updateRobot(robot: Robot) {
    this.http.post(this.apiUrl, robot).subscribe({
      next: () => {
        console.log(`Robot updated at [${robot.x}, ${robot.y}, ${robot.direction}]!`);
      },
      error: (err) => console.error('Error creating robot:', err)
    });
  }

  getRobots() {
    this.http.get<Robot[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Fetched robots:', data);

        if (data.length > 0) {
          this.robot = data[data.length - 1];
          this.gridCells.fill('');
          let index = this.robot.x + (4 - this.robot.y) * 5
          this.gridCells[index] = 'X';
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error fetching robots:', err)
    });
  }

  clearRobots() {
    this.robot = null;
    this.robotOutput = "";
    this.gridCells.fill('');

    this.http.delete(this.apiUrl).subscribe({
      next: () => {
        console.log('All robots cleared from database!');
      },
      error: (err) => {
        console.error('Error clearing robots:', err);
      }
    });
  }
}