import {
    Controller,
    Post,
    UploadedFiles,
    Body,
    UseInterceptors,
  } from '@nestjs/common';
    import { FilesInterceptor } from '@nestjs/platform-express';
    // import { diskStorage, File as MulterFile } from 'multer';
    import multer, {diskStorage, Multer } from 'multer';
    import { Request, Response } from 'express';
    import { extname } from 'path';
    import { v4 as uuidv4 } from 'uuid';
    import { UploadService } from './upload.service';
  
  @Controller('uploads') // uploads 엔드포인트로 컨트롤러를 설정
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @UseInterceptors(
      FilesInterceptor('files', 10, {
        storage: diskStorage({
          destination: './uploads', // 업로드 파일 저장 경로
          filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
            cb(null, uniqueSuffix); // 저장할 파일 이름 설정
          },
        }),
        fileFilter: (req, file, cb) => {
          // 파일 필터링 (필요에 따라 확장자 제한 가능)
          const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4'];
          if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file type'), false);
          }
        },
      }),
    )
    async handleUpload(
      @UploadedFiles() files: Express.Multer.File[], // 업로드된 파일 배열
      @Body() body: { text: string },  // 클라이언트에서 전송된 텍스트
    ) {
      if (!files || files.length === 0) {
        if (!body.text) {
          throw new Error('No files uploaded and no text provided');
        }
        const result = await this.uploadService.saveData(body.text, []);
        return {
          message: 'Upload successful with text only',
          data: { text: body.text },
          result,
        };
      }

      // 파일 경로 추출
      const filePaths = files.map((file) => file.path);

      // UploadService를 통해 파일과 텍스트 처리
      const result = await this.uploadService.saveData(body.text, filePaths);

      return {
        message: 'Upload successful',
        data: { text: body.text, filePaths },
        result,
      };
    }
  }
    