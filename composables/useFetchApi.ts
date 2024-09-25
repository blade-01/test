export default () => {
  const config = useRuntimeConfig();
  const BASE_URL = config.public.baseURL;
  const headers: HeadersInit = {
    "User-Type": "Portaluser",
    "X-Company-Api-Key": config.public.companyApiKey
  };

  if (import.meta.client) {
    const { data } = useAuth();
    const user: any = data.value?.user;
    if (user?.accessToken) {
      headers["Authorization"] = `Bearer ${user.accessToken}`;
    }
  }

  const get = async <T>(endpoint: string, options?: { [key: string]: any }) => {
    const { data } = useAuth();
    if (data.value?.user && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${
        (data.value as any).user.accessToken
      }`;
    }
    return rawFetch<T>(endpoint, {
      ...options,
      headers
    });
  };

  const rawFetch = async <T>(
    endpoint: string,
    options?: { [key: string]: any }
  ) =>
    $fetch<T>(endpoint, {
      baseURL: BASE_URL,
      ...options
    });

  const postCurry =
    (method: "POST" | "PATCH" | "PUT" | "DELETE") =>
    async <T>(endpoint: string, body: any, options?: { [key: string]: any }) =>
      $fetch<T>(endpoint, {
        baseURL: BASE_URL,
        method,
        body,
        ...options,
        headers
      });

  const post = postCurry("POST");
  const patch = postCurry("PATCH");
  const put = postCurry("PUT");
  const del = postCurry("DELETE");

  return {
    get,
    post,
    patch,
    put,
    del,
    rawFetch
  };
};
