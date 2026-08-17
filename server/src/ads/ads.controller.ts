import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { QueryAdsDto } from './dto/query-ads.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad } from './entities/ad.entity';


@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {
    
  }

  @Get()
  findAll(@Query() query: QueryAdsDto): Ad[] {
    return this.adsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Ad {
    return this.adsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAdDto, @CurrentUser() user: string): Promise<Ad> {
    return this.adsService.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdDto,
    @CurrentUser() user: string,
  ): Promise<Ad> {
    return this.adsService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: string): Promise<void> {
    return this.adsService.remove(id, user);
  }
}
