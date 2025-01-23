import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UploadEntity } from './upload.entity';

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

  @OneToMany(() => UploadEntity, upload => upload.emotion)
  uploads: UploadEntity[];
}
