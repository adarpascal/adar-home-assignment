import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CarDataLayer } from './car.dal';
import { AddCarDto, UpdateCarPriceDto } from '../dto';
import { Car, CarSize } from '../types';

@Injectable()
export class CarService {
  constructor(private carDataLayer: CarDataLayer) {}

  getAllCars(): Car[] {
    return this.carDataLayer.getAllCars();
  }

  getCarsBySize(size: CarSize): Car[] {
    return this.carDataLayer.getCarsBySize(size);
  }

  getAvailableCarsByReservationPeriod(pickupDate: Date, returnDate: Date): Car[] {
    return this.carDataLayer.getAvailableCarsByReservationPeriod(pickupDate, returnDate);
  }

  addCar(input: AddCarDto): Car {
    return this.carDataLayer.addCar(input);
  }

  setPrice(id: string, input: UpdateCarPriceDto): void {
    try {
      this.carDataLayer.setPrice(id, input.pricePerDay);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  reserveCar(carId: string, pickupDate: Date, returnDate: Date): void {
    try {
      this.carDataLayer.reserveCar(carId, pickupDate, returnDate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  removeCar(id: string): void {
    try {
      this.carDataLayer.removeCar(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
