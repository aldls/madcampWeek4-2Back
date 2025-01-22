import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('emotion')
export class Emotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  emotion: string;

  @Column('json')
  analysisResult: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
