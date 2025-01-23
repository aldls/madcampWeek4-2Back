import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
