import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { Emotion } from '../entities/emotion.entity'

@Controller('emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Get()
    findAll(): Promise<Emotion []> {
      return this.emotionService.findAll();
    }

  @Post('analyze')
  async analyzeText(@Body('textId') textId: number): Promise<any> {
    if (!textId) {
      throw new HttpException('Text ID is required.', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.emotionService.analyzeAndSaveEmotion(textId);
      return { message: 'Emotion analysis successful.', data: result };
    } catch (error) {
      throw new HttpException(
        `Failed to analyze emotion: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
