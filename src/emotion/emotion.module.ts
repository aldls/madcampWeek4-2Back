import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emotion } from '../entities/emotion.entity';
import { EmotionService } from './emotion.service';
import { EmotionController } from './emotion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion])],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}
