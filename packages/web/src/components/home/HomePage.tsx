import { WalletStatus } from "./WalletStatus";
import { useNetworkVariable } from "../../networkConfig";
// import { OwnedObjects } from "./OwnedObjects";
import { useSuiClientQuery } from "@mysten/dapp-kit";
function HomePage() {
  const dashboardId = useNetworkVariable("dashboardId");
  console.log("dashboardId", dashboardId);

  const { data: dashboard } = useSuiClientQuery("getObject", {
    id: dashboardId,
    options: {
      showContent: true,
    },
  });

  if (!dashboard || !dashboard.data) return null;

  return (
    <div className="flex-1 overflow-auto mt-[57px] py-2 w-[70%] mx-auto">
      <WalletStatus />
      {/* <OwnedObjects /> */}
      {/* Proposals */}
    </div>
  );
}

export default HomePage;
