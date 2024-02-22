import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarDataLayer } from './car.dal';

@Module({
  imports: [],
  controllers: [CarController],
  providers: [CarService, CarDataLayer],
})
export class CarModule {}
