export enum CarSize {
  MIN = 'min',
  MID = 'mid',
  LARGE = 'large',
}

export interface Car {
  id: string;
  model: string;
  size: CarSize;
  pricePerDay: number;
}

export interface Reservation {
  carId: string;
  pickupDate: Date;
  returnDate: Date;
}
