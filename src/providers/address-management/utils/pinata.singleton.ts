import pinataSDK from '@pinata/sdk';

class PinataSingleton {
  private static instance: any;

  private constructor() {}

  static getInstance(): InstanceType<typeof pinataSDK> {
    if (!PinataSingleton.instance) {
      PinataSingleton.instance = new pinataSDK({
        pinataJWTKey: process.env.PINATA_API_KEY!,
      });
    }
    return PinataSingleton.instance;
  }
}

export const pinata = PinataSingleton.getInstance();
