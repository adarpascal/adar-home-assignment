import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { AddCarDto, GetCarsByFiltersDto, ReserveCarDto, UpdateCarPriceDto } from '../dto';
import { Car } from '../types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  getCars(): Car[] {
    return this.carService.getAllCars();
  }

  @Get('/filter')
  getCarsByFilter(@Query() filters: GetCarsByFiltersDto): Car[] {
    if (filters.size) return this.carService.getCarsBySize(filters.size);
    if (filters.pickupDate && filters.returnDate)
      return this.carService.getAvailableCarsByReservationPeriod(
        new Date(filters.pickupDate),
        new Date(filters.returnDate),
      );
    return this.carService.getAllCars();
  }

  @Post()
  createCar(@Body() input: AddCarDto): Car {
    return this.carService.addCar(input);
  }

  @Post('/reserve')
  reserveCar(@Body() input: ReserveCarDto): void {
    this.carService.reserveCar(input.carId, new Date(input.pickupDate), new Date(input.returnDate));
  }

  @Put(':id/price')
  updateCarPrice(@Param('id') id: string, @Body() input: UpdateCarPriceDto): void {
    return this.carService.setPrice(id, input);
  }

  @Delete('/:id')
  removeCar(@Param('id') id: string): void {
    this.carService.removeCar(id);
  }
}
