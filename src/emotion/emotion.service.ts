import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from '../entities/emotion.entity';
import { UploadEntity } from '../entities/upload.entity'; // 텍스트가 저장된 Upload 엔티티
import axios from 'axios';

@Injectable()
export class EmotionService {
  constructor(
    @InjectRepository(Emotion)
    private readonly emotionRepository: Repository<Emotion>,
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
  ) {}

  findAll(): Promise<Emotion[]> {
      return this.emotionRepository.find();
    }

  private readonly huggingFaceApiUrl = 'https://api-inference.huggingface.co/models/michellejieli/emotion_text_classifier';

  async analyzeAndSaveEmotion(textId: number): Promise<Emotion> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      throw new HttpException('Hugging Face API key is missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 1. 텍스트 조회
    const upload = await this.uploadRepository.findOne({ where: { id: textId } });
    if (!upload) {
      throw new HttpException('Text not found in the database.', HttpStatus.NOT_FOUND);
    }

    try {
      // 2. 감정 분석 API 호출
      const response = await axios.post(
        this.huggingFaceApiUrl,
        { inputs: upload.text },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const emotion = response.data[0]?.label || 'unknown';
      const analysisResult = JSON.stringify(response.data);

      console.log(emotion);
      console.log(analysisResult);

      // 3. 감정 분석 결과 저장
      const emotionEntity = this.emotionRepository.create({
        text: upload.text,
        emotion,
        analysisResult,
      });
      console.log(emotionEntity);

      return await this.emotionRepository.save(emotionEntity);
    } catch (error) {
      throw new HttpException(
        `Failed to analyze emotion: ${error.response?.data?.error || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
