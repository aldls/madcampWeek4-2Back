import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('uploads')
export class UploadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagePath: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  videoPath: string;
}
