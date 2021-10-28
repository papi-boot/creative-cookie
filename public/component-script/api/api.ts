import { ApiInterface } from "../interface/interface";
export class API {
  public async sendApiRequest(item: ApiInterface): Promise<any> {
    console.log(item);
    const { params, httpMethod, routes } = item;
    const response = await fetch(routes, {
      method: httpMethod,
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: httpMethod !== "GET" ? JSON.stringify(params) : null,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status >= 400) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(
        "Something went wrong. Please check your network/server or try again later."
      );
    }
  }
}
