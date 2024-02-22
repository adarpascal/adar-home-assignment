import { mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CarService } from '../car.service';
import { CarDataLayer } from '../car.dal';
import { Car, CarSize } from '../../types';
import { AddCarDto, UpdateCarPriceDto } from 'src/dto';

const mockCarDataLayer = mockDeep<CarDataLayer>();

describe('CarService', () => {
  let service: CarService;
  let datalayer: CarDataLayer;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CarService, { provide: CarDataLayer, useValue: mockCarDataLayer }],
    }).compile();

    service = module.get<CarService>(CarService);
    datalayer = module.get<CarDataLayer>(CarDataLayer);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('data layer mock should be defined', () => {
    expect(datalayer).toBeDefined();
  });

  describe('getAllCars', () => {
    it('should return an array of cars', async () => {
      const cars: Car[] = [
        { id: 'uuid-1234', model: 'hyundai 2011', size: CarSize.LARGE, pricePerDay: 100 },
        { id: 'uuid-5678', model: 'mazda 2008', size: CarSize.LARGE, pricePerDay: 20 },
        { id: 'uuid-9876', model: 'camaro 2016', size: CarSize.LARGE, pricePerDay: 250 },
      ];

      mockCarDataLayer.getAllCars.mockReturnValueOnce(cars);

      const result = service.getAllCars();

      expect(result).toEqual(cars);
      expect(mockCarDataLayer.getAllCars).toHaveBeenCalled();
    });
  });

  describe('addCar', () => {
    it('should add a car and return the added car', async () => {
      const input: AddCarDto = { model: 'hyundai 2011', size: CarSize.LARGE, pricePerDay: 50 };
      const car: Car = { id: '2', ...input };

      mockCarDataLayer.addCar.mockReturnValue(car);

      const result = service.addCar(input);

      expect(result).toEqual(car);
      expect(mockCarDataLayer.addCar).toHaveBeenCalledWith(input);
    });
  });

  describe('setPrice', () => {
    it('should update the cars price', async () => {
      const input: UpdateCarPriceDto = { pricePerDay: 220 };

      service.setPrice('1', input);

      expect(mockCarDataLayer.setPrice).toHaveBeenCalledWith('1', input.pricePerDay);
      expect(() => service.setPrice('1', input)).not.toThrow();
    });

    it('should throw NotFoundException if car does not exist', async () => {
      mockCarDataLayer.setPrice.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => service.setPrice('non-existing-id', { pricePerDay: 100 })).toThrow(NotFoundException);
    });
  });

  describe('getCarsBySize', () => {
    it('should return cars of a specific size', async () => {
      const mockCars: Car[] = [
        { id: '1', model: 'hyundai 2011', size: CarSize.MID, pricePerDay: 30 },
        { id: '2', model: 'chevrolet 2016', size: CarSize.MID, pricePerDay: 30 },
      ];

      mockCarDataLayer.getCarsBySize.mockReturnValue(mockCars);

      const result = service.getCarsBySize(CarSize.MID);

      expect(result).toEqual(mockCars);
      expect(mockCarDataLayer.getCarsBySize).toHaveBeenCalledWith(CarSize.MID);
    });
  });

  describe('getAvailableCarsByReservationPeriod', () => {
    it('should return available cars for a reservation period', async () => {
      const mockCars: Car[] = [{ id: '1', model: 'hyndai 2011', size: CarSize.LARGE, pricePerDay: 100 }];
      const pickupDate = new Date();
      const returnDate = new Date();

      mockCarDataLayer.getAvailableCarsByReservationPeriod.mockReturnValue(mockCars);

      const result = service.getAvailableCarsByReservationPeriod(pickupDate, returnDate);

      expect(result).toEqual(mockCars);
      expect(mockCarDataLayer.getAvailableCarsByReservationPeriod).toHaveBeenCalledWith(pickupDate, returnDate);
    });
  });

  describe('reserveCar', () => {
    it('should reserve a car', async () => {
      const carId = '1';
      const pickupDate = new Date();
      const returnDate = new Date();

      mockCarDataLayer.reserveCar.mockImplementationOnce(() => {});

      expect(() => service.reserveCar(carId, pickupDate, returnDate)).not.toThrow();
      expect(mockCarDataLayer.reserveCar).toHaveBeenCalledWith(carId, pickupDate, returnDate);
    });

    it('should throw BadRequestException on error', async () => {
      const carId = '1';
      const pickupDate = new Date();
      const returnDate = new Date();
      mockCarDataLayer.reserveCar.mockImplementationOnce(() => {
        throw new Error('Car already reserved for the selected period');
      });
      expect(() => service.reserveCar(carId, pickupDate, returnDate)).toThrow(BadRequestException);
    });
  });

  describe('removeCar', () => {
    it('should remove a car', () => {
      const carId = '1';

      expect(() => service.removeCar(carId)).not.toThrow();
      expect(mockCarDataLayer.removeCar).toHaveBeenCalledWith(carId);
    });

    it('should throw NotFoundException on error', () => {
      const carId = '999';

      mockCarDataLayer.removeCar.mockImplementationOnce(() => {
        throw new Error('car does not exist');
      });

      expect(() => service.removeCar(carId)).toThrow(NotFoundException);
    });
  });
});
