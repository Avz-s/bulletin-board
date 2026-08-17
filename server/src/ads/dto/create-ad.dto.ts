import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { AD_CATEGORIES, AdCategory } from '../categories';
import { LocationDto } from './location.dto';

export class CreateAdDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  description: string;

  // @IsOptional()
  @IsIn(AD_CATEGORIES)
  category: AdCategory;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;


  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @Matches(/^\/uploads\/[a-zA-Z0-9._-]+$/, {
    message: 'imageUrl must be a valid path starting with /uploads/',
  })
  imageUrl?: string | null;
}
