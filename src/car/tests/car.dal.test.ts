import { Test, TestingModule } from '@nestjs/testing';
import { CarDataLayer } from '../car.dal';
import { CarSize } from '../../types';
import { AddCarDto } from '../../dto';

describe('CarDataLayer', () => {
  let datalayer: CarDataLayer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarDataLayer],
    }).compile();

    datalayer = module.get<CarDataLayer>(CarDataLayer);
  });

  it('should be defined', () => {
    expect(datalayer).toBeDefined();
  });

  describe('getAllCars', () => {
    it('should return all cars', () => {
      datalayer.addCar({ model: 'hyundai', size: CarSize.MIN, pricePerDay: 100 });
      datalayer.addCar({ model: 'camaro', size: CarSize.LARGE, pricePerDay: 200 });

      const cars = datalayer.getAllCars();

      expect(cars.length).toBe(2);
    });

    it('should return empty array if there are no cars', () => {
      const cars = datalayer.getAllCars();

      expect(cars.length).toBe(0);
    });
  });

  describe('getCarsBySize', () => {
    it('should return found cars by size', async () => {
      datalayer.addCar({ model: 'hyundai', size: CarSize.MIN, pricePerDay: 100 });
      datalayer.addCar({ model: 'mazda', size: CarSize.MIN, pricePerDay: 100 });
      datalayer.addCar({ model: 'chevrolet', size: CarSize.MID, pricePerDay: 100 });

      const cars = datalayer.getCarsBySize(CarSize.MIN);

      expect(cars.every((car) => car.size === CarSize.MIN)).toBe(true);
    });

    it('should return empty array if no cars found', async () => {
      datalayer.addCar({ model: 'chevrolet', size: CarSize.MID, pricePerDay: 100 });
      datalayer.addCar({ model: 'toyota', size: CarSize.LARGE, pricePerDay: 100 });

      const cars = datalayer.getCarsBySize(CarSize.MIN);

      expect(cars.length).toEqual(0);
    });
  });

  describe('getAvailableCarsByReservationPeriod', () => {
    it('should return available cars for the requested period', async () => {
      datalayer.addCar({ model: 'hyundai', size: CarSize.MIN, pricePerDay: 200 });
      datalayer.addCar({ model: 'mazda', size: CarSize.LARGE, pricePerDay: 100 });

      const pickupDate = new Date('2024-02-20');
      const returnDate = new Date('2024-02-22');

      const availableCars = datalayer.getAvailableCarsByReservationPeriod(pickupDate, returnDate);
      expect(availableCars.length).toBeGreaterThan(0);
    });

    it('should return empty array if no car is available on requested period', () => {
      const car = datalayer.addCar({ model: 'hyundai', size: CarSize.MIN, pricePerDay: 200 });
      const pickupDate = new Date('2024-02-20');
      const returnDate = new Date('2024-02-22');
      datalayer.reserveCar(car.id, pickupDate, returnDate);

      const availableCars = datalayer.getAvailableCarsByReservationPeriod(pickupDate, returnDate);
      expect(availableCars.length).toEqual(0);
    });
  });

  describe('addCar', () => {
    it('should add a new car and return it', async () => {
      const input: AddCarDto = { model: 'tesla', size: CarSize.MID, pricePerDay: 250 };
      const car = datalayer.addCar(input);

      expect(car).toBeDefined();
    });
  });

  describe('setPrice', () => {
    it('should update the price of a car', async () => {
      const input: AddCarDto = { model: 'lada', size: CarSize.MID, pricePerDay: 10 };
      const car = datalayer.addCar(input);

      datalayer.setPrice(car.id, 100);

      const updatedCar = datalayer.getAllCars().find((x) => x.id === car.id);
      expect(updatedCar.pricePerDay).toBe(100);
    });

    it('should throw error if the car does not exist', () => {
      expect(() => datalayer.setPrice('not-real-id', 100)).toThrow('car does not exist');
    });
  });

  describe('reserveCar', () => {
    it('should reserve a car for the requested period', async () => {
      const input: AddCarDto = { model: 'hyundai', size: CarSize.LARGE, pricePerDay: 200 };
      const car = datalayer.addCar(input);

      const pickupDate = new Date('2023-02-20');
      const returnDate = new Date('2023-02-22');
      datalayer.reserveCar(car.id, pickupDate, returnDate);

      expect(() => datalayer.reserveCar(car.id, pickupDate, returnDate)).toThrow(
        'Car already reserved for the selected period',
      );
    });
  });

  describe('removeCar', () => {
    it('should remove a car', async () => {
      const input: AddCarDto = { model: 'volvo', size: CarSize.LARGE, pricePerDay: 150 };
      const car = datalayer.addCar(input);
      datalayer.removeCar(car.id);

      expect(datalayer.getAllCars()).not.toContain(car);
    });

    it('should throw error if the car does not exist', () => {
      expect(() => datalayer.removeCar('not-existing-id')).toThrow('car does not exist');
    });
  });
});
