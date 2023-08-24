import useAuthentication from "./useAuthentication";
import useRefreshToken from "./useRefreshToken";
import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";

export default function useAxiosPrivate() {
  const {
    authentication: {
      user: { accessToken },
    },
    setAuthentication,
  } = useAuthentication();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"])
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        let errorStatusCode = error.response.status;
        let wasPreviouslySent = error?.config?.wasPreviouslySent;

        const previousRequestConfig = error?.config;
        if (errorStatusCode === 403 && !wasPreviouslySent) {
          previousRequestConfig.wasPreviouslySent = true;
          const newAccessToken = await refresh();
          previousRequestConfig.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          return axiosPrivate(previousRequestConfig);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refresh, setAuthentication]);

  return axiosPrivate;
}
