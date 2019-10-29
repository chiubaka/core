export declare abstract class Api<TAdapter> {
    static UNSUCCESSFUL_API_REQUEST_TYPE: string;
    static unsuccessfulRequest(reason: string): {
        type: string;
        reason: string;
    };
    private adapter;
    constructor(adapter: TAdapter);
    protected getAdapter(): TAdapter;
}
