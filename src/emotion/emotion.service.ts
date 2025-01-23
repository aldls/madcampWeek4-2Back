import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Emotion } from '../entities/emotion.entity';
import axios from 'axios';

@Injectable()
export class EmotionService {
    constructor(
        @InjectRepository(Emotion)
        private readonly emotionRepository: Repository<Emotion>,
      ) {}
    
    private readonly huggingFaceApiUrl = 'https://api-inference.huggingface.co/models/michellejieli/emotion_text_classifier';
    // private readonly huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY; // HuggingFace API 키를 추가하세요.

    async analyzeEmotion(text: string): Promise<any> {
        try {
        const response = await axios.post(
            this.huggingFaceApiUrl,
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        const emotion = response.data[0]?.label || 'unknown';
        const result = {
            text,
            emotion,
            analysisResult: JSON.stringify(response.data),
        };
        
        await this.emotionRepository.save(result);
        // return response.data;
        return result;

        } catch (error) {
            // throw new HttpException(
            //     `Failed to analyze emotion: ${error.response?.data?.error || error.message}`,
            //     HttpStatus.INTERNAL_SERVER_ERROR,
            // );
            throw new Error(`Failed to analyze emotion: ${error.message}`);
        }
    }
}
