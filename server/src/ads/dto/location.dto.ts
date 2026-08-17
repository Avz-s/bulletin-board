import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString } from 'class-validator';

export class LocationDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsOptional()
  @IsString()
  address?: string;
}
