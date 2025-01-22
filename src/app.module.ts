import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './entities/user.entity';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.64.63.49',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: 'root',
      password: 'week4',
      database: 'insideOut',
      autoLoadEntities: true,
      synchronize: true,
      entities: [User],
      logging: true,
    }),
  ],
})
export class AppModule {}
