import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from '../entities/emotion.entity';
import { UploadEntity } from '../entities/upload.entity'; // 텍스트가 저장된 Upload 엔티티
import axios from 'axios';
import * as fs from 'fs';

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
  private readonly huggingFaceImageApiUrl = 'https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection'; // 이미지 감정 분석 API URL

  async analyzeAndSaveEmotion(textId: number): Promise<Emotion> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      throw new HttpException('Hugging Face API key is missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 1. 업로드 데이터 조회
    const upload = await this.uploadRepository.findOne({ where: { id: textId } });
    if (!upload) {
      throw new HttpException('Text not found in the database.', HttpStatus.NOT_FOUND);
    }

    try {
        let response;
        let emotion;
        let analysisResult;
      // 2. 감정 분석 API 호출
      if(upload.text){
        response = await axios.post(
            this.huggingFaceApiUrl,
            { inputs: upload.text },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            },
          );
          // 감정 분석 결과
         const firstEmotion = response.data[0]?.[0]?.label || 'unknown';

         // 첫 번째 감정이 'neutral'이라면 두 번째 값을 선택
         emotion = firstEmotion === 'neutral' 
         ? response.data[0]?.[1]?.label || 'unknown' 
         : firstEmotion;
         analysisResult = JSON.stringify(response.data);
      } else if (upload.imagePath) {
        // 이미지가 있을 경우 이미지 감정 분석 API 호출
        const imageUrl = upload.imagePath; // 이미지 경로를 사용 (S3 URL 등)
        const imageData = fs.readFileSync(imageUrl);
        
        console.log(imageUrl);
        response = await axios.post(
          this.huggingFaceImageApiUrl,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response);

        // 감정 분석 결과
        const firstEmotion = response.data[0]?.label || 'unknown';

        emotion = firstEmotion === 'neutral' 
         ? response.data[1]?.label || 'unknown' 
         : firstEmotion;
         analysisResult = JSON.stringify(response.data);
      } else {
        throw new HttpException('No text or image found for analysis.', HttpStatus.BAD_REQUEST);
      }


      console.log(emotion);
      console.log(analysisResult)

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
