import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadEntity } from '../entities/upload.entity';
import { EmotionService } from 'src/emotion/emotion.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
    private readonly emotionService: EmotionService,
  ) {}

  async saveData(text: string, filePaths: string[]): Promise<any> {
    const uploadRecord = this.uploadRepository.create({
      text,
      imagePath: filePaths.find((path) => path.endsWith('.png') || path.endsWith('.jpg')),
      videoPath: filePaths.find((path) => path.endsWith('.mp4')),
    });

    const savedUpload = await this.uploadRepository.save(uploadRecord);
    const emotionAnalysis = await this.emotionService.analyzeAndSaveEmotion(savedUpload.id);

    return {
      uploadedText: {
        id: savedUpload.id,
        text: savedUpload.text,
        imagePath: savedUpload.imagePath,
        videoPath: savedUpload.videoPath,
      },
      emotionAnalysis,
    };
  }
}
