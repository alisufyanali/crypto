import { Config } from "ziggy-js";

declare global {
  const Ziggy: Config;
  function route(
    name?: string,
    params?: any,
    absolute?: boolean,
    config?: Config
  ): string;
}

export {};
