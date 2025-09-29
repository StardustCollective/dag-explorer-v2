"use client";

import { useState } from "react";
import { configure } from "safe-stable-stringify";

const stringify = configure({
  deterministic: false,
  maximumDepth: 10,
});

const ProxiedConsoleSymbol = Symbol("ProxiedConsoleSymbol");

const proxyConsoleMethods = (
  callback: (method: string, args: any[]) => void
) => {
  const consoleObject = console as any;

  if (consoleObject[ProxiedConsoleSymbol]) {
    return;
  }

  const consoleMethods = ["log", "warn", "error", "info", "debug", "dir"];

  consoleMethods.forEach((method) => {
    const originalMethod = consoleObject[method];

    consoleObject[method] = new Proxy(originalMethod, {
      apply(target, thisArg, argumentsList) {
        callback(method, argumentsList);
        return Reflect.apply(target, thisArg, argumentsList);
      },
    });
  });

  consoleObject[ProxiedConsoleSymbol] = true;
};

export const useProxiedLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);

  proxyConsoleMethods((method, args) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      `[${method.toUpperCase()}] ${args
        .map((arg) => stringify(arg, null, 2))
        .join(" ")}`,
    ]);
  });

  return logs;
};
