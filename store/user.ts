import ApiRoutes from "~/constant/ApiRoutes";

export const useUserStore = defineStore("UserStore", () => {
  const user = ref<AuthUser>();

  const getUser = async () => {
    try {
      const { data } = await useFetchApi().rawFetch<AuthUserDataResponse>(
        ApiRoutes.user.me,
        {
          method: "GET",
          headers: {
            Referer: useHost().hostname
          }
        }
      );

      user.value = data.user;
      console.log("Data", data);
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      throw new Error(err);
    }
  };

  return {
    getUser
  };
});
