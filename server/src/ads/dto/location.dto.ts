import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @IsLatitude()
  // @IsNumber()
  lat: number;

  @IsLongitude()
  // @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  address?: string;
}
