import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Car, CarSize, Reservation } from '../types';
import { AddCarDto } from '../dto';

@Injectable()
export class CarDataLayer {
  private catalog: Record<string, Car> = {};
  private reservations: Reservation[] = [];

  getAllCars(): Car[] {
    return Object.values(this.catalog);
  }

  getCarsBySize(size: CarSize): Car[] {
    return this.getAllCars().filter((car) => car.size === size);
  }

  getAvailableCarsByReservationPeriod(pickupDate: Date, returnDate: Date): Car[] {
    return this.getAllCars().filter((car) => !this.isReservationExists(car.id, pickupDate, returnDate));
  }

  addCar(car: AddCarDto): Car {
    const id = uuidv4();
    const newCar = { id, ...car };
    this.catalog[id] = newCar;
    return newCar;
  }

  setPrice(id: string, newPrice: number): void {
    if (this.catalog[id]) {
      this.catalog[id].pricePerDay = newPrice;
    } else {
      throw new Error('car does not exist');
    }
  }

  reserveCar(carId: string, pickupDate: Date, returnDate: Date): void {
    if (!this.isReservationExists(carId, pickupDate, returnDate)) {
      const reservation: Reservation = { carId, pickupDate, returnDate };
      this.reservations.push(reservation);
    } else {
      throw new Error('Car already reserved for the selected period');
    }
  }

  removeCar(id: string): void {
    if (this.catalog[id]) {
      delete this.catalog[id];
      return;
    } else {
      throw new Error('car does not exist');
    }
  }

  private isReservationExists(carId: string, pickupDate: Date, returnDate: Date): boolean {
    return this.reservations.some(
      (reservation) =>
        reservation.carId === carId && pickupDate <= reservation.returnDate && returnDate >= reservation.pickupDate,
    );
  }
}
