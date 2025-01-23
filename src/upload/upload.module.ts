import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadEntity } from '../entities/upload.entity';
import { multerOptions } from './upload.options';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadEntity]),
    MulterModule.register(multerOptions),  // Multer 설정 등록
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
