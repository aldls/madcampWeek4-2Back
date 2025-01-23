import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Emotion } from './emotion.entity';

@Entity('uploads')
export class UploadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'text', nullable: true })
  imagePath: string;

  @Column({ type: 'text', nullable: true })
  videoPath: string;

  @OneToOne(() => Emotion, { cascade: true, eager: true }) // Emotion과 1:1 관계
  @JoinColumn({ name: 'emotionId'}) // Upload가 Emotion의 외래 키를 소유
  emotion: Emotion;
}
