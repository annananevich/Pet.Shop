import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";

// Обновленный интерфейс с response
export interface ICustomWorld {
  token: string;
  deleteToken: string;
  pet: any;
  petIds: number[];
  pets: any[];
  response?: any; // <-- Добавили response
}

// Реализация класса
export class CustomWorld extends World implements ICustomWorld {
  token = "";
  deleteToken = "";
  pet: any = null;
  petIds: number[] = [];
  pets: any[] = [];
  response?: any; // <-- Добавили response

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
