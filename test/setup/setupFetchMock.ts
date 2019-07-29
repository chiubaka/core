
import fetchMock, { FetchMockSandbox, FetchMockStatic} from "fetch-mock";
import "isomorphic-fetch";
import Global = NodeJS.Global;

export interface IGlobalWithFetchMock extends Global {
  fetchMock: FetchMockStatic;
  fetch: FetchMockSandbox;
  Headers: any;
}

fetchMock.config.overwriteRoutes = false;

const customGlobal: IGlobalWithFetchMock = global as IGlobalWithFetchMock;
customGlobal.fetch = fetchMock.sandbox();
customGlobal.fetchMock = fetchMock;
customGlobal.Headers = class Headers {
  public headers: {[key: string]: string};

  constructor() {
    this.headers = {};
  }

  public append(key: string, value: string) {
    this.headers[key] = value;
  }

  public get(key: string) {
    return this.headers[key];
  }
};
