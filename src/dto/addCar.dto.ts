import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Car, CarSize } from '../types';

export class AddCarDto implements Omit<Car, 'id'> {
  @ApiProperty({ type: String, example: 'hyundai', required: true })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({ type: String, example: 'large', required: true })
  @IsNotEmpty()
  @IsEnum(CarSize)
  size: CarSize;

  @ApiProperty({ type: Number, example: 100, required: true })
  @IsNotEmpty()
  @IsNumber()
  pricePerDay: number;
}
