import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Account, Profile, User, Session } from "next-auth";
import { AUTH_ROUTES } from "@/routes/authRoutes";

type GoogleProfile = Profile & {
  name?: string;
  email?: string;
  picture?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        mode: { label: "Mode", type: "text" },
        // standard signin fields
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        // signup fields (when using NextAuth to call backend directly)
        name: { label: "Name", type: "text" },
        gender: { label: "Gender", type: "text" },
        dateOfBirth: { label: "Date of Birth", type: "text" },
        phoneNumber: { label: "Phone Number", type: "text" },
        image: { label: "Image (base64)", type: "text" },
        // tokenLogin fields (when frontend already has tokens)
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        user: { label: "User JSON", type: "text" },
      },
      async authorize(credentials) {
        // Support three modes: tokenLogin (direct tokens), signup, signin
        const mode = (credentials?.mode || "signin").toString();
        if (mode === "tokenLogin") {
          try {
            // credentials.user may be passed as an object or a JSON string. Handle both.
            let uRaw: any = credentials?.user ?? {};
            if (typeof uRaw === "string") {
              try {
                uRaw = JSON.parse(uRaw);
              } catch (e) {
                // fallthrough to error below
                throw new Error("Invalid tokenLogin user payload (malformed JSON)");
              }
            }
            const u = uRaw as { id: string; email: string; name?: string | null; image?: string | null };
            if (!u || !u.id || !u.email) {
              throw new Error("Invalid tokenLogin user payload (missing id/email)");
            }
            return {
              id: u.id,
              email: u.email,
              name: u.name ?? undefined,
              image: u.image ?? undefined,
              accessToken: (credentials?.accessToken as string) || "",
              refreshToken: (credentials?.refreshToken as string) || "",
              backendUser: {
                id: u.id,
                email: u.email,
                name: u.name ?? null,
                image: u.image ?? null,
              },
            } as unknown as User & {
              accessToken: string;
              refreshToken: string;
              backendUser: { id: string; email: string; name: string | null; image: string | null };
            };
          } catch (e) {
            // Keep the original error shape for NextAuth
            throw e instanceof Error ? e : new Error("Invalid tokenLogin user payload");
          }
        }

        // For signup/signin via backend
        const url = mode === "signup" ? AUTH_ROUTES.credential.signup : AUTH_ROUTES.credential.signin;
        const body = mode === "signup"
          ? {
              name: credentials?.name?.toString().trim(),
              email: credentials?.email?.toString().trim().toLowerCase(),
              gender: credentials?.gender?.toString() || undefined,
              dateOfBirth: credentials?.dateOfBirth?.toString() || undefined,
              phoneNumber: credentials?.phoneNumber?.toString() || undefined,
              password: credentials?.password?.toString(),
              image: credentials?.image?.toString() || undefined,
            }
          : {
              email: credentials?.email?.toString().trim().toLowerCase(),
              password: credentials?.password?.toString(),
            };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Backend ${mode} failed: ${res.status} ${text}`);
        }
        const data = (await res.json()) as {
          customer?: { id: string; email: string; name: string | null; image: string | null };
          user?: { id: string; email: string; name: string | null; image: string | null };
          accessToken: string;
          refreshToken: string;
        };
        const u = data.user || data.customer;
        if (!u) throw new Error("Backend did not return a user");
        return {
          id: u.id,
          email: u.email,
          name: u.name ?? undefined,
          image: u.image ?? undefined,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          backendUser: u,
        } as unknown as User & {
          accessToken: string;
          refreshToken: string;
          backendUser: { id: string; email: string; name: string | null; image: string | null };
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile, trigger }: {
      token: JWT;
      account?: Account | null;
      user?: User;
      profile?: Profile;
      trigger?: "signIn" | "signUp" | "update";
    }) {
      // On first sign in with Google, exchange profile with backend to get tokens
      if (account?.provider === "google" && (trigger === "signIn" || !token.accessToken)) {
        const name = (user?.name || (profile as GoogleProfile)?.name || "").trim();
        const email = (user?.email || (profile as GoogleProfile)?.email || "").trim().toLowerCase();
        const image = user?.image || (profile as GoogleProfile)?.picture || null;

        if (!name || !email) {
          // Abort sign-in without tokens if required fields are missing
          return token;
        }

        // console.log("Entire Google profile data:", profile);

        try {
          const res = await fetch(AUTH_ROUTES.google.signin, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, image }),
          });

          if (!res.ok) {
            // Throwing here fails the sign-in, which is preferred to a half-configured session
            const text = await res.text();
            throw new Error(`Backend signin failed: ${res.status} ${text}`);
          }

          const data = (await res.json()) as {
            user: { id: string; email: string; name: string | null; image: string | null };
            accessToken: string;
            refreshToken: string;
            accessTokenExpiresIn?: number;
            refreshTokenExpiresIn?: number;
          };

          token.accessToken = data.accessToken;
          token.refreshToken = data.refreshToken;
          token.backendUser = data.user;
        } catch (err) {
          // Surface the error to NextAuth to stop the flow
          throw err;
        }
      }

      // On credentials sign in, tokens are returned from authorize via `user`
      if (account?.provider === "credentials" && user) {
        const u = user as unknown as {
          accessToken?: string;
          refreshToken?: string;
          backendUser?: { id: string; email: string; name: string | null; image: string | null };
          id?: string;
          email?: string;
          name?: string | null;
          image?: string | null;
        };
        if (u.accessToken) token.accessToken = u.accessToken;
        if (u.refreshToken) token.refreshToken = u.refreshToken;
        if (u.backendUser) {
          token.backendUser = u.backendUser;
        } else if (u.id && u.email) {
          token.backendUser = {
            id: u.id,
            email: u.email,
            name: (u.name as string | null) ?? null,
            image: (u.image as string | null) ?? null,
          };
        }
      }

      return token;
    },
  async session({ session, token }: {
    session: Session;
    token: JWT;
  }) {
      if (token) {
        // Attach tokens to session for client/server usage
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        // Prefer backend user shape if available
        const backendUser = token.backendUser;
        if (backendUser) {
          session.user = {
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.name ?? undefined,
            image: backendUser.image ?? undefined,
          };
        } else if (session.user) {
          // Ensure id is present if available via token.sub
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
});

export const { GET, POST } = handlers;
