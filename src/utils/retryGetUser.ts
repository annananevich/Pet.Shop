import { getUser } from "../api/usersApi";

export async function retryGetUser(
  username: string,
  attempts: number = 3
): Promise<any> {
  let user;
  let retries = 0;

  while (retries < attempts) {
    const getResponse = await getUser(username);
    console.log(`[getUser] Attempt ${retries + 1}:`, getResponse.body);

    if (getResponse.status === 200 && getResponse.body.username === username) {
      user = getResponse.body;
      break;
    }

    retries++;
    await new Promise((res) => setTimeout(res, 1000)); // Wait 1 second before retrying
  }

  if (!user) {
    throw new Error(`Failed to fetch user data after ${attempts} attempts.`);
  }

  return user;
}
