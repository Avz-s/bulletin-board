import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { JsonStorageService } from './json-storage.service';

@Module({
  controllers: [AdsController],
  providers: [AdsService, JsonStorageService],
})
export class AdsModule {}
