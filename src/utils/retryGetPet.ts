import { getPet } from "../api/petsApi";

export async function retryGetPet(
  petId: number,
  attempts: number = 5,
  delayMs: number = 5000
): Promise<any> {
  let pet;
  let retries = 0;

  while (retries < attempts) {
    try {
      console.log(`Fetching pet with ID: ${petId} (Attempt ${retries + 1})`);
      const response = await getPet(petId);

      if (response.status === 200) {
        pet = response.body;
        break;
      }

      retries++;
      console.warn(
        `Attempt ${retries} failed, retrying in ${delayMs / 1000} seconds...`
      );
      await new Promise((res) => setTimeout(res, delayMs));
    } catch (err) {
      retries++;
      console.error(`Error on attempt ${retries}:`, err);
      if (retries < attempts) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  if (!pet) {
    throw new Error(
      `Failed to retrieve pet with ID ${petId} after ${attempts} attempts`
    );
  }

  return pet;
}
