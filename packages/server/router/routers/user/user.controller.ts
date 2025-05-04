import { prisma, pgPool } from "../../../db/prisma.ts"; // Ensure correct import

// Store WebSocket listeners for new users
const userListeners: ((user: any) => void)[] = [];

// Get User by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

// Subscribe WebSocket Clients to New Users
export function subscribeToNewUsers(listener: (user: any) => void) {
  userListeners.push(listener);
  return () => {
    const index = userListeners.indexOf(listener);
    if (index !== -1) userListeners.splice(index, 1);
  };
}

// Create User and Notify WebSockets & PostgreSQL
export async function createUser(name: string, bio?: string) {
  const user = await prisma.user.create({
    data: { name, bio },
  });

  console.log("New user created in DB:", user);

  // Notify WebSocket Clients
  userListeners.forEach((listener) => listener(user));

  // Notify PostgreSQL LISTEN/NOTIFY system
  await pgPool.query(`NOTIFY new_user, '${JSON.stringify(user)}'`);
  console.log("📡 PostgreSQL NOTIFY triggered");

  return user;
}
