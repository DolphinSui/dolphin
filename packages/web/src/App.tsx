import { ConnectButton } from "@mysten/dapp-kit";

//Components
import HomePage from "./components/home/HomePage";
import { useEffect, useState } from "react";
import { trpc } from "./lib/trpcClient";

// Define a User type based on your database model
type User = {
  id: string;
  name: string;
  bio?: string;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverTime, setServerTime] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 Fetching user...");
    const fetchUser = async () => {
      try {
        const userData = await trpc.user.getUserById.query(
          "57c4ca3d-d08c-4876-92c0-ca9154ad031b"
        );
        setUser(userData);
        console.log("User Data:", userData);
      } catch (error) {
        console.error("❌ User Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Listen to ping subscription (WebSocket)
  // useEffect(() => {
  //   const subscription = trpc.api.ping.subscribe(undefined, {
  //     onData(data) {
  //       console.log("🔁 Ping:", data);
  //       setServerTime(data.time); // update UI with latest time
  //     },
  //     onError(err) {
  //       console.error("WebSocket Error:", err);
  //     },
  //   });

  //   // Cleanup on unmount
  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <div className="h-screen flex flex-col bg-black  text-white">
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between px-4 py-2 border-b border-gray-200 bg-black">
        <div>
          <h1 className="text-2xl font-bold ">My dApp</h1>
          <p className="text-sm text-gray-400">Server Time: {serverTime}</p>
        </div>
        <ConnectButton />
      </div>

      <HomePage />
    </div>
  );
}

export default App;
