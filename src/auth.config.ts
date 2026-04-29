import type { NextAuthConfig } from "next-auth";

/**
 * Config "edge-safe" — folosit de middleware. NU conține providers care
 * fac apeluri DB (bcrypt, prisma), ca să poată rula în Edge Runtime.
 * Providerul real Credentials este adăugat în src/auth.ts.
 */
const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" as const },
  trustHost: true,
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
