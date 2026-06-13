import axios from "axios";
import { logout, saveAuthToken } from "../../utils/helper";
import {
  API_FAILED,
  INTERNET_FAILED,
  JSON_HEADER,
  BASE_URL,
  kPost,
  kGet,
  KAUthToken,
  kPut,
  kDelete,
} from "./commonValue";
import { USER_SESSION_API } from "./endpoints";
import { getData, setData } from "./keyChain";
import { isNetworkAvailable } from "./network";

interface Params {
  method?: string;
  headers?: object;
  data?: object;
}

type ApiValues = {
  url?: string;
  data?: any;
  header: object | any;
};

const methodFetchAccessToken = async (): Promise<string | boolean> => {
  const header = JSON_HEADER;
  const dic = { refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." };
  const params = {
    method: kPost,
    headers: { ...header, auth_token: "1542de3a-2fd5-4c94-98d6-812cf964c47b" },
    data: JSON.stringify(dic),
  };

  const accessToken: string | null | undefined = await getData(KAUthToken);
  if (accessToken) return accessToken;

  try {
    const url = BASE_URL + USER_SESSION_API?.get_auth_token;
    console.log("response>>get_auth_token", url, params);
    const response = await axios(url, params);
    console.log("response>>response", response);
    if (response?.data?.status) {
      const token = response?.data?.data?.value;
      saveAuthToken(token);
      await setData(KAUthToken, token);
      return token;
    }
    return false;
  } catch (error) {
    // console.log("response>>response",error);
    return false;
  }
};

export const post = async ({ url, data, header = JSON_HEADER }: ApiValues) => {
  if (!(await isNetworkAvailable())) return INTERNET_FAILED;
  // const authToken = await methodFetchAccessToken();

  let params: Params = {
    method: kPost,
    headers: {
      ...header,
      ...(global.userToken && { Authorization: `Bearer ${global.userToken}` }),
      ...{ auth_token: "a20c177f-0242-462e-850a-641ae7d5f6ef" },
      // ...{auth_token: '1542de3a-2fd5-4c94-98d6-812cf964c47b'},
    },
    data: data,
  };
  console.log("BASE_URL + url, params>>", BASE_URL + url, params);

  try {
    const response = await axios(BASE_URL + url, params);

    if ([401, 411, 402, 404].includes(response.status)) {
      logout(true);
    }

    return response?.data;
  } catch (error: any) {
    if ([401, 402, 404, 411].includes(error?.response?.status)) {
      logout(true);
    }
    if (
      [
        "Your account has been logged out, due to login in another device.",
      ].includes(error.response.data?.message)
    ) {
      return {
        status: false,
        message: error.response.data?.message,
      };
      logout(true);
    }
    console.log("error------", error);

    return API_FAILED;
  }
};

export const put = async ({ url, data, header = JSON_HEADER }: ApiValues) => {
  if (!(await isNetworkAvailable())) return INTERNET_FAILED;
  // const authToken = await methodFetchAccessToken();

  let params: Params = {
    method: kPut,
    headers: {
      ...header,
      ...(userToken && { Authorization: `Bearer ${userToken}` }),
      ...{ auth_token: "a20c177f-0242-462e-850a-641ae7d5f6ef" },
      // ...{auth_token: '1542de3a-2fd5-4c94-98d6-812cf964c47b'},
    },
    data: data,
  };
  console.log("BASE_URL + url, params>>", BASE_URL + url, params);

  try {
    const response = await axios(BASE_URL + url, params);

    if ([401, 402, 404].includes(response.status)) {
      logout(true);
    }

    return response?.data;
  } catch (error) {
    console.log("error------", error);

    return API_FAILED;
  }
};

export const Delete = async ({
  url,
  data,
  header = JSON_HEADER,
}: ApiValues) => {
  if (!(await isNetworkAvailable())) return INTERNET_FAILED;
  // const authToken = await methodFetchAccessToken();

  let params: Params = {
    method: kDelete,
    headers: {
      ...header,
      ...(userToken && { Authorization: `Bearer ${userToken}` }),
      ...{ auth_token: "1542de3a-2fd5-4c94-98d6-812cf964c47b" },
    },
    data: data,
  };
  console.log("BASE_URL + url, params>>", BASE_URL + url, params);

  try {
    const response = await axios(BASE_URL + url, params);

    if ([401, 402, 404].includes(response.status)) {
      logout(true);
    }

    return response?.data;
  } catch (error) {
    console.log("error------", error);

    return API_FAILED;
  }
};

export const get = async ({ url }: ApiValues) => {
  if (!(await isNetworkAvailable())) return INTERNET_FAILED;

  // const authToken = await methodFetchAccessToken();

  let params: Params = {
    method: kGet,
    headers: {
      JSON_HEADER,
      ...{ Authorization: `Bearer ${global.userToken}` },
      ...{ auth_token: "a20c177f-0242-462e-850a-641ae7d5f6ef" },
    },
  };

  try {
    const response = await axios(BASE_URL + url, params);

    if ([401, 402, 404].includes(response.status)) {
      logout(true);
    }
    return response?.data;
  } catch (error: any) {
    if ([401, 402, 404, 411].includes(error?.response?.status)) {
      logout(true);
    }
    if (
      [
        "Your account has been logged out, due to login in another device.",
      ].includes(error.response.data?.message)
    ) {
      return {
        status: false,
        message: error.response.data?.message,
      };
      logout(true);
    }
    console.log("error------", error);

    return API_FAILED;
  }
};




