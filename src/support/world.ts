import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";

// Обновленный интерфейс с response
export interface ICustomWorld {
  token: string;
  deleteToken: string;
  pet: any;
  petIds: number[];
  pets: any[];
  userData: any;
  loginResponse: any;
  orderData?: any;
  response?: any;
}

// Реализация класса
export class CustomWorld extends World implements ICustomWorld {
  token = "";
  deleteToken = "";
  pet: any = null;
  petIds: number[] = [];
  pets: any[] = [];
  userData: any = null;
  loginResponse: any = null;
  orderData?: any;
  response?: any;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
