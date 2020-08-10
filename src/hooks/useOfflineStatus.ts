import { AppData, AppNetworkStatus } from "types";
import { useEffect } from "react";

export function useOfflineStatus(data: AppData) {
  useEffect(() => {
    window.addEventListener("online", () => {
      data.networkStatus = AppNetworkStatus.ONLINE;
    });
  }, [data]);

  useEffect(() => {
    window.addEventListener("offline", () => {
      data.networkStatus = AppNetworkStatus.OFFLINE;
    });
  }, [data]);
}
