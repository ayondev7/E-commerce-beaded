import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import AUTH_ROUTES from "@/routes/authRoutes";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile, trigger }: any) {
      // On first sign in with Google, exchange profile with backend to get tokens
      if (account?.provider === "google" && (trigger === "signIn" || !token.accessToken)) {
        const name = (user?.name || (profile as any)?.name || "").trim();
        const email = (user?.email || (profile as any)?.email || "").trim().toLowerCase();
        const image = (user as any)?.image || (profile as any)?.picture || null;

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
  async session({ session, token }: any) {
      if (token) {
        // Attach tokens to session for client/server usage
        (session as any).accessToken = (token as any).accessToken;
        (session as any).refreshToken = (token as any).refreshToken;
        // Prefer backend user shape if available
        const backendUser = (token as any).backendUser as
          | { id: string; email: string; name: string | null; image: string | null }
          | undefined;
        if (backendUser) {
          session.user = {
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.name ?? undefined,
            image: backendUser.image ?? undefined,
          } as any;
        } else if (session.user) {
          // Ensure id is present if available via token.sub
          (session.user as any).id = (token as any).sub;
        }
      }
      return session;
    },
  },
});
