import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
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
