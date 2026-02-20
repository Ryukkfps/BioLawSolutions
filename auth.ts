import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log('User found in DB:', user ? { id: user.id, email: user.email } : 'null');

          if (user && user.password === credentials.password) {
            console.log('Password match success');
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }

          console.log('Password match failed or user not found');
          return null;
        } catch (error) {
          console.error('Auth database error:', error);
          return null;
        }
      },
    }),
  ],
});
