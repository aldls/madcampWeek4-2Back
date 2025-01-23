import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emotion } from '../entities/emotion.entity';
import { UploadEntity } from '../entities/upload.entity'
import { EmotionService } from './emotion.service';
import { EmotionController } from './emotion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion, UploadEntity])],
  controllers: [EmotionController],
  providers: [EmotionService],
  exports: [EmotionService],
})
export class EmotionModule {}
