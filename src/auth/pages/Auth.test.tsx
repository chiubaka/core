import React from "react";

import { AuthRestApiAdapter } from "../actions";
import { Auth } from "./Auth";

describe("Auth", () => {
  it("types allow for passing of the adapter option", () => {
        // tslint:disable-next-line no-unused-expression
        <Auth adapter={AuthRestApiAdapter.getInstance()}/>;
  });
});
