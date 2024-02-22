import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCarPriceDto {
  @ApiProperty({ type: Number, example: 400, required: true })
  @IsNotEmpty()
  @IsNumber()
  pricePerDay: number;
}
