import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    Body,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
  import { diskStorage, File as MulterFile } from 'multer';
  import { v4 as uuidv4 } from 'uuid';
  import { UploadService } from './upload.service';
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
  
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async handleUpload(
      @UploadedFiles() files: Array<MulterFile>,
      @Body('text') text: string,
    ) {
      const filePaths = files.map((file) => file.path); // 저장된 파일 경로
      const result = await this.uploadService.saveData(text, filePaths);
      return { message: 'Upload successful', result };
    }
  }
  