import { faker } from "@faker-js/faker";

export const generateUserData = () => ({
  id: faker.number.int({ min: 100000, max: 999999 }),
  username: faker.internet.displayName(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.number(),
  userStatus: faker.number.int({ min: 0, max: 1 }),
});
