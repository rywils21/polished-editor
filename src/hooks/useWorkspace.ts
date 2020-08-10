import { AppData } from "types";
import { useState } from "react";

export interface WorkspaceData {
  selectedWorkspace: string;
  workspaces: string[];
  chooseWorkspace: (workspace: string) => void;
}

export function useWorkspace(data: AppData): WorkspaceData {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("Default");
  const workspaces = ["Default"];
  const chooseWorkspace = (workspace: string) => {
    setSelectedWorkspace(workspace);
  };

  return {
    selectedWorkspace,
    workspaces,
    chooseWorkspace
  };
}
