export abstract class Api<TAdapter> {
  public static UNSUCCESSFUL_API_REQUEST_TYPE = "UNSUCCESSFUL_API_REQUEST";

  public static unsuccessfulRequest(reason: string) {
    return {
      type: Api.UNSUCCESSFUL_API_REQUEST_TYPE,
      reason,
    };
  }

  private adapter: TAdapter;

  constructor(adapter: TAdapter) {
    this.adapter = adapter;
  }

  protected getAdapter(): TAdapter {
    return this.adapter;
  }
}
