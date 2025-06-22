import { Fireblocks, BasePath } from "@fireblocks/ts-sdk";

class FireblocksSingleton {
  private static instance: Fireblocks;

  private constructor() {}

  public static getInstance(): Fireblocks {
    if (!FireblocksSingleton.instance) {
      const apiKey = process.env.FIREBLOCKS_CW_API_KEY_ADMIN;
      const secret = process.env.FIREBLOCKS_CW_SECRET_KEY;

      if (!apiKey || !secret) {
        throw new Error(
          "Missing FIREBLOCKS_CW_API_KEY_ADMIN or FIREBLOCKS_CW_SECRET_KEY in env",
        );
      }

      FireblocksSingleton.instance = new Fireblocks({
        apiKey,
        secretKey: secret.replace(/\\n/g, "\n"),
        basePath: FireblocksSingleton.resolveBasePath(),
      });
    }

    return FireblocksSingleton.instance;
  }

  private static resolveBasePath(): BasePath {
    const envType = process.env.FIREBLOCKS_CW_API_BASE_URL_TYPE;

    switch (envType) {
      case "US":
        return BasePath.US;
      case "EU":
        return BasePath.EU;
      case "EU2":
        return BasePath.EU2;
      case "Sandbox":
      default:
        return BasePath.Sandbox;
    }
  }
}

export const fireblocks = FireblocksSingleton.getInstance();
