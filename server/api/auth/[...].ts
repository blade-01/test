import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import ApiRoutes from "~~/constant/ApiRoutes";
import useFetchApi from "~~/composables/useFetchApi";

const getUserData = async (
  token: string
): Promise<Pick<AuthUserDataResponse, "data">> => {
  try {
    const user = await useFetchApi().rawFetch<AuthUserDataResponse>(
      ApiRoutes.user.me,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Type": "Portaluser",
          "X-Company-Api-Key": useRuntimeConfig().public.companyApiKey
        }
      }
    );

    if (!user || !user.result) {
      throw new Error("User not found");
    }

    return {
      data: user.data
    };
  } catch (err: any) {
    console.error("Error fetching user data:", err);
    throw new Error(err);
  }
};

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any, event: any) {
        try {
          // Get JWT token from API endpoint using credentials
          const res = await useFetchApi().post<SignInResponse>(
            ApiRoutes.auth.signIn,
            {
              email: credentials.email,
              password: credentials.password,
              rememberMe: credentials.rememberMe || false
            }
          );
          if (res.result && res.data.token) {
            return {
              accessToken: res.data.token,
              status: undefined
            };
          } else {
            throw createError({
              statusCode: 403,
              statusMessage: "Credentials not working"
            });
          }
          // Return user data
        } catch (err: any) {
          console.log("err in NuxtAuthHandler: ", err);
          throw createError({
            message: err.data.message,
            statusCode: err.status
          });
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      // This is true when the user is signing in for the first time
      if (user) {
        token = {
          ...token,
          ...user
        };
      }
      return token;
    },
    // @ts-ignore
    async session({ session, token }) {
      if (!token.accessToken) {
        console.error("No accessToken found in token");
        return session;
      }

      try {
        const newData = await getUserData(token.accessToken as string);

        if (!newData.data.user) {
          console.error("No user found in newData");
          return session;
        }

        (session as any).user = {
          ...session.user,
          ...token,
          ...newData.data.user,
          roles: newData.data.roles
        };

        return Promise.resolve(session);
      } catch (err: any) {
        console.error("Error in session callback: ", err);
        return session; // Return session even in case of an error to avoid blank responses
      }
    }
  },

  events: {
    // Signs out the user from the API Server
    async signOut({ token }) {
      await useFetchApi().rawFetch<unknown>(ApiRoutes.auth.signOut, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });
    }
  }
});
