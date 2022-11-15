

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: any, args: unknown[]): void;
        on(
          channel: any,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: any, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
