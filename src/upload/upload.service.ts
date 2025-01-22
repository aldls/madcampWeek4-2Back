import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadEntity } from '../entities/upload.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
  ) {}

  async saveData(text: string, filePaths: string[]): Promise<UploadEntity> {
    const uploadRecord = this.uploadRepository.create({
      text,
      imagePath: filePaths.find((path) => path.endsWith('.png') || path.endsWith('.jpg')),
      videoPath: filePaths.find((path) => path.endsWith('.mp4')),
    });
    return this.uploadRepository.save(uploadRecord);
  }
}
