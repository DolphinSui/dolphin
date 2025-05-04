import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router/index";
import { serverConfig } from "../../config";
import superjson from "superjson";

// Initialize tRPC client
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:${serverConfig.port}/trpc`,
    }),
  ],
  transformer: superjson, // Fix: Add superjson to match server
});

async function test() {
  try {
    console.log("🚀 Creating a new user...");
    const newUser = await trpc.user.createUser.mutate({
      name: "Test User",
      bio: "This is a test user.",
    });
    console.log("New User Created:", newUser);

    console.log("🔍 Fetching user by ID...");
    const user = await trpc.user.getUserById.query(newUser.id);
    console.log("Fetched User:", user);
  } catch (error) {
    console.error("❌ API Error:", error);
  }
}

test();
