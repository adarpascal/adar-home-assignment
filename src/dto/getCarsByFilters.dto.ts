import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarSize } from '../types';

export class GetCarsByFiltersDto {
  @ApiProperty({ enum: CarSize, required: false })
  @IsOptional()
  @IsEnum(CarSize)
  size?: CarSize;

  @ApiProperty({
    type: String,
    example: new Date(new Date().setHours(new Date().getHours(), 0, 0, 0)),
    required: false,
  })
  @IsOptional()
  @IsDateString()
  pickupDate?: string;

  @ApiProperty({
    type: String,
    example: new Date(new Date().setHours(new Date().getHours(), 0, 0, 0)),
    required: false,
  })
  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
