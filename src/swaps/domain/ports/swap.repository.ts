export abstract class SwapRepository {
  abstract save(data: any): Promise<void>;
}
