import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../types';

export class ReserveCarDto implements Reservation {
  @ApiProperty({ type: String, example: 'auto-generated-uuid', required: true })
  @IsNotEmpty()
  @IsString()
  carId: string;

  @ApiProperty({ type: String, example: new Date(new Date().setHours(new Date().getHours(), 0, 0, 0)), required: true })
  @IsNotEmpty()
  @IsDateString()
  pickupDate: Date;

  @ApiProperty({ type: String, example: new Date(new Date().setHours(new Date().getHours(), 0, 0, 0)), required: true })
  @IsNotEmpty()
  @IsDateString()
  returnDate: Date;
}
