import { contextBridge, ipcRenderer } from "electron";
const notchAPI = {
  setExpanded: (expanded) => {
    ipcRenderer.send("set-notch-expanded", expanded);
  },
  setIgnoreMouseEvents: (ignore, forward = true) => {
    ipcRenderer.send("set-ignore-mouse-events", ignore, forward);
  },
  getSystemInfo: () => {
    return ipcRenderer.invoke("get-system-info");
  },
  quitApp: () => {
    ipcRenderer.send("quit-app");
  },
  onBlur: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("notch-blur", handler);
    return () => {
      ipcRenderer.removeListener("notch-blur", handler);
    };
  }
};
try {
  contextBridge.exposeInMainWorld("notchAPI", notchAPI);
} catch (error) {
  console.error("Failed to expose notchAPI into renderer context:", error);
}
