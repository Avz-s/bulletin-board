import { Type } from 'class-transformer';
import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

import { AD_CATEGORIES, AdCategory } from '../categories';



export class QueryAdsDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsIn(AD_CATEGORIES)
  category?: AdCategory;

  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  // @IsNumber()
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  // @IsNumber()
  lng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  radiusKm?: number;
}
