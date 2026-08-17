import { Module } from '@nestjs/common';
import { AdsModule } from './ads/ads.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [AdsModule, UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
