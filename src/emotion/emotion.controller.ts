import { Controller, Post, Body } from '@nestjs/common';
import { EmotionService } from './emotion.service';

@Controller('emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Post('text')
  async analyze(@Body('text') text: string): Promise<any> {
    if (!text || text.trim().length === 0) {
      return { error: 'Text cannot be empty.' };
    }
    const result = await this.emotionService.analyzeEmotion(text);
    return result;
  }
}
